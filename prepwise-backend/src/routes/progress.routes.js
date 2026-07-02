import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/progress - per-category progress for the logged-in user
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT c.id AS category_id, c.name, c.slug,
              COALESCE(p.completed_count, 0) AS completed_count,
              COALESCE(p.total_count, (SELECT COUNT(*) FROM questions q WHERE q.category_id = c.id)) AS total_count,
              p.last_attempt_at
       FROM categories c
       LEFT JOIN user_progress p ON p.category_id = c.id AND p.user_id = $1
       ORDER BY c.name`,
      [req.user.id]
    );

    const progress = rows.map((r) => ({
      ...r,
      percent: r.total_count > 0 ? Math.round((r.completed_count / r.total_count) * 100) : 0,
    }));

    res.json({ progress });
  } catch (err) {
    next(err);
  }
});

// GET /api/progress/summary - overall stats across all categories
router.get("/summary", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         COUNT(DISTINCT s.id)::int AS sessions_completed,
         COALESCE(AVG(s.score_percent) FILTER (WHERE s.status = 'completed'), 0)::numeric(5,2) AS avg_score,
         COALESCE(SUM(s.correct_answers), 0)::int AS total_correct,
         COALESCE(SUM(s.total_questions), 0)::int AS total_questions_attempted
       FROM interview_sessions s
       WHERE s.user_id = $1 AND s.status = 'completed'`,
      [req.user.id]
    );
    res.json({ summary: rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
