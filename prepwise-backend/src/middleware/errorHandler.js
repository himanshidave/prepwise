export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "23505") {
    // Postgres unique_violation
    return res.status(409).json({ error: "Resource already exists" });
  }
  if (err.code === "23503") {
    // Postgres foreign_key_violation
    return res.status(400).json({ error: "Related resource does not exist" });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}
