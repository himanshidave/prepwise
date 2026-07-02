import { Router } from "express";
import { pool, query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// POST /api/interviews/start
// body: { categoryId? | categorySlug?, questionCount? }
router.post("/start", async (req, res, next) => {
  try {
    const { categoryId, categorySlug, questionCount = 10 } = req.body;

    let category = null;
    if (categoryId || categorySlug) {
      const { rows } = await query(
        `SELECT id, name, slug FROM categories WHERE ${
          categoryId ? "id = $1" : "slug = $1"
        }`,
        [categoryId || categorySlug]
      );
      category = rows[0];
      if (!category) return res.status(404).json({ error: "Category not found" });
    }

    const { rows: questions } = await query(
      `SELECT id, question, difficulty, category_id
       FROM questions
       ${category ? "WHERE category_id = $1" : ""}
       ORDER BY RANDOM()
       LIMIT $${category ? 2 : 1}`,
      category ? [category.id, questionCount] : [questionCount]
    );

    if (questions.length === 0) {
      return res.status(400).json({ error: "No questions available for this selection" });
    }

    const { rows: sessionRows } = await query(
      `INSERT INTO interview_sessions (user_id, category_id, total_questions)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, category_id, status, started_at`,
      [req.user.id, category ? category.id : null, questions.length]
    );

    res.status(201).json({
      session: sessionRows[0],
      questions, // answers withheld on purpose ("reveal" happens client-side per question)
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/interviews/:sessionId/answer
// body: { questionId, isCorrect, timeTakenSecs? }
router.post("/:sessionId/answer", async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId, isCorrect, timeTakenSecs } = req.body;

    if (questionId === undefined || typeof isCorrect !== "boolean") {
      return res.status(400).json({ error: "questionId and isCorrect (boolean) are required" });
    }

    const session = await getOwnedSession(sessionId, req.user.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.status !== "in_progress") {
      return res.status(400).json({ error: "Session is no longer in progress" });
    }

    const { rows } = await query(
      `INSERT INTO interview_session_answers (session_id, question_id, is_correct, time_taken_secs)
       VALUES ($1, $2, $3, $4)
       RETURNING id, session_id, question_id, is_correct, time_taken_secs, answered_at`,
      [sessionId, questionId, isCorrect, timeTakenSecs ?? null]
    );

    res.status(201).json({ answer: rows[0] });
  } catch (err) {
    next(err);
  }
});

// POST /api/interviews/:sessionId/complete
// body: { durationSeconds? }
router.post("/:sessionId/complete", async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { sessionId } = req.params;
    const { durationSeconds } = req.body;

    await client.query("BEGIN");

    const { rows: sessionRows } = await client.query(
      `SELECT * FROM interview_sessions WHERE id = $1 AND user_id = $2 FOR UPDATE`,
      [sessionId, req.user.id]
    );
    const session = sessionRows[0];
    if (!session) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Session not found" });
    }

    const { rows: statsRows } = await client.query(
      `SELECT COUNT(*)::int AS answered,
              COUNT(*) FILTER (WHERE is_correct)::int AS correct
       FROM interview_session_answers WHERE session_id = $1`,
      [sessionId]
    );
    const { answered, correct } = statsRows[0];
    const totalQuestions = session.total_questions || answered || 1;
    const scorePercent = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

    const { rows: updatedRows } = await client.query(
      `UPDATE interview_sessions
       SET status = 'completed',
           correct_answers = $1,
           score_percent = $2,
           duration_seconds = $3,
           completed_at = now()
       WHERE id = $4
       RETURNING *`,
      [correct, scorePercent.toFixed(2), durationSeconds ?? null, sessionId]
    );

    // Update / upsert progress tracker for this category
    if (session.category_id) {
      await client.query(
        `INSERT INTO user_progress (user_id, category_id, completed_count, total_count, last_attempt_at)
         VALUES ($1, $2, $3, (SELECT COUNT(*) FROM questions WHERE category_id = $2), now())
         ON CONFLICT (user_id, category_id)
         DO UPDATE SET
           completed_count = GREATEST(user_progress.completed_count, $3),
           total_count = (SELECT COUNT(*) FROM questions WHERE category_id = $2),
           last_attempt_at = now()`,
        [req.user.id, session.category_id, correct]
      );
    }

    await client.query("COMMIT");
    res.json({ session: updatedRows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

// GET /api/interviews - history for the logged-in user
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT s.*, c.name AS category_name, c.slug AS category_slug
       FROM interview_sessions s
       LEFT JOIN categories c ON c.id = s.category_id
       WHERE s.user_id = $1
       ORDER BY s.started_at DESC`,
      [req.user.id]
    );
    res.json({ sessions: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/interviews/:sessionId - detail + answers
router.get("/:sessionId", async (req, res, next) => {
  try {
    const session = await getOwnedSession(req.params.sessionId, req.user.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const { rows: answers } = await query(
      `SELECT a.id, a.question_id, a.is_correct, a.time_taken_secs, a.answered_at,
              q.question, q.answer, q.difficulty
       FROM interview_session_answers a
       JOIN questions q ON q.id = a.question_id
       WHERE a.session_id = $1
       ORDER BY a.answered_at`,
      [req.params.sessionId]
    );

    res.json({ session, answers });
  } catch (err) {
    next(err);
  }
});

async function getOwnedSession(sessionId, userId) {
  const { rows } = await query(
    `SELECT * FROM interview_sessions WHERE id = $1 AND user_id = $2`,
    [sessionId, userId]
  );
  return rows[0];
}

export default router;
