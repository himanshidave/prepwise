// Manually (re)create the schema against DATABASE_URL.
// Useful if you're not using docker-compose's auto-init.
// Usage: npm run db:init
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function init() {
  const sql = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  await pool.query(sql);
  console.log("✅ Schema created/updated.");
  await pool.end();
}

init().catch((err) => {
  console.error("❌ Failed to initialize schema:", err.message);
  process.exit(1);
});
