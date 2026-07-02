import { Router } from "express";
import { query } from "../db/pool.js";

const router = Router();

// GET /api/categories - list all categories with question counts
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT c.id, c.name, c.slug, c.description, c.icon,
              COUNT(q.id)::int AS question_count
       FROM categories c
       LEFT JOIN questions q ON q.category_id = c.id
       GROUP BY c.id
       ORDER BY c.name`
    );
    res.json({ categories: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:idOrSlug
router.get("/:idOrSlug", async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isNumeric = /^\d+$/.test(idOrSlug);

    const { rows } = await query(
      `SELECT id, name, slug, description, icon FROM categories WHERE ${
        isNumeric ? "id = $1" : "slug = $1"
      }`,
      [isNumeric ? Number(idOrSlug) : idOrSlug]
    );

    if (!rows[0]) return res.status(404).json({ error: "Category not found" });
    res.json({ category: rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
