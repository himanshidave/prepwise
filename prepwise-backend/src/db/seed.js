// Manually seed demo data against DATABASE_URL.
// Useful if you're not using docker-compose's auto-init.
// Usage: npm run db:seed
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function seed() {
  const sql = readFileSync(join(__dirname, "seed.sql"), "utf-8");
  await pool.query(sql);
  console.log("✅ Seed data inserted.");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Failed to seed data:", err.message);
  process.exit(1);
});
