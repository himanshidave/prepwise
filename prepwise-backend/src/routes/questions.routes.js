import { Router } from "express";
import { query } from "../db/pool.js";

const router = Router();

// GET /api/questions?category=slug-or-id&difficulty=easy&limit=10&random=true
router.get("/", async (req, res, next) => {
  try {
    const { category, difficulty, limit, random } = req.query;
    const conditions = [];
    const params = [];

    if (category) {
      const isNumeric = /^\d+$/.test(category);
      params.push(isNumeric ? Number(category) : category);
      conditions.push(
        isNumeric
          ? `q.category_id = $${params.length}`
          : `c.slug = $${params.length}`
      );
    }
    if (difficulty) {
      params.push(difficulty);
      conditions.push(`q.difficulty = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderClause = random === "true" ? "ORDER BY RANDOM()" : "ORDER BY q.id";
    const limitClause = limit && /^\d+$/.test(limit) ? `LIMIT ${Number(limit)}` : "";

    const { rows } = await query(
      `SELECT q.id, q.question, q.answer, q.difficulty, q.category_id,
              c.name AS category_name, c.slug AS category_slug
       FROM questions q
       JOIN categories c ON c.id = q.category_id
       ${whereClause}
       ${orderClause}
       ${limitClause}`,
      params
    );

    res.json({ questions: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/questions/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT q.id, q.question, q.answer, q.difficulty, q.category_id,
              c.name AS category_name, c.slug AS category_slug
       FROM questions q
       JOIN categories c ON c.id = q.category_id
       WHERE q.id = $1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Question not found" });
    res.json({ question: rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
