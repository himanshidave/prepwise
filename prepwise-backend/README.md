# PrepWise Backend

Express + PostgreSQL API for the PrepWise interview-prep app. Covers auth,
categories, questions, mock interview sessions, and progress tracking —
matching the 15‑day roadmap in the frontend README.

## Stack

- **Express 4** – REST API, JSON in/out
- **PostgreSQL 16** – via the `pg` driver, run in Docker
- **JWT** (`jsonwebtoken`) – stateless auth
- **bcryptjs** – password hashing

## Quick start (Docker)

This spins up Postgres **and** the API together. The database schema and
seed data (demo users, categories, questions) load automatically on first
boot via `docker-entrypoint-initdb.d`.

```bash
docker compose up --build
```

- API: http://localhost:5000
- Postgres: localhost:5432 (user: `prepwise`, password: `prepwise_pass`, db: `prepwise_db`)

To wipe the database and reseed from scratch:

```bash
docker compose down -v
docker compose up --build
```

### Demo login

| Email | Password |
|-------|----------|
| demo@prepwise.com | demo123 |
| student@prepwise.com | 123456 |

## Running the API on your host instead (optional)

If you'd rather run Node directly on your machine against the dockerized
Postgres:

```bash
# start only postgres
docker compose up postgres -d

cp .env.example .env
npm install
npm run dev
```

`.env`'s `DATABASE_URL` already points at `localhost:5432`, matching the
Postgres port exposed by docker-compose.

## Connecting the React frontend

In the PrepWise frontend, point API calls at `http://localhost:5000/api`
(e.g. via a `VITE_API_URL` env var and `fetch(`${import.meta.env.VITE_API_URL}/auth/login`)`).
Also update `Login.jsx`'s current `fetch('/users.json')` flow to instead
`POST /api/auth/login`, storing the returned `token` (e.g. in `localStorage`)
and sending it as `Authorization: Bearer <token>` on subsequent requests.

CORS is restricted to `CORS_ORIGIN` (default `http://localhost:5173`, Vite's
default dev port).

## Project structure

```
prepwise-backend/
├── docker-compose.yml       # Postgres + API containers
├── Dockerfile
├── .env.example
├── package.json
└── src/
    ├── server.js            # App entry point, route mounting
    ├── db/
    │   ├── pool.js          # pg Pool + query() helper
    │   ├── schema.sql       # Table definitions (auto-run by Docker)
    │   ├── seed.sql         # Demo data (auto-run by Docker)
    │   ├── init.js          # npm run db:init  (manual schema apply)
    │   └── seed.js          # npm run db:seed  (manual seed apply)
    ├── middleware/
    │   ├── auth.js          # requireAuth (JWT verification)
    │   └── errorHandler.js
    └── routes/
        ├── auth.routes.js
        ├── categories.routes.js
        ├── questions.routes.js
        ├── interviews.routes.js
        └── progress.routes.js
```

## Data model

- **users** – id, name, email, password_hash
- **categories** – HTML, CSS, JavaScript, React, Node.js, SQL (seeded)
- **questions** – belongs to a category, has difficulty (easy/medium/hard)
- **interview_sessions** – a mock-interview attempt: category, score, timing, status
- **interview_session_answers** – each question answered within a session
- **user_progress** – per-user, per-category completed/total counts (for the progress bar)

## API reference

All responses are JSON. Protected routes require:
`Authorization: Bearer <token>`

### Auth
| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | – | `{ name, email, password }` | Create account, returns `{ token, user }` |
| POST | `/api/auth/login` | – | `{ email, password }` | Returns `{ token, user }` |
| GET | `/api/auth/me` | ✅ | – | Current user profile |

### Categories
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | – | List all categories with question counts |
| GET | `/api/categories/:idOrSlug` | – | Single category (e.g. `/api/categories/html`) |

### Questions
| Method | Route | Auth | Query params | Description |
|---|---|---|---|---|
| GET | `/api/questions` | – | `category`, `difficulty`, `limit`, `random=true` | Filterable question list |
| GET | `/api/questions/:id` | – | – | Single question with answer |

### Mock interviews
| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/api/interviews/start` | ✅ | `{ categoryId? / categorySlug?, questionCount? }` | Starts a session, returns random questions (no answers) |
| POST | `/api/interviews/:sessionId/answer` | ✅ | `{ questionId, isCorrect, timeTakenSecs? }` | Records the self-graded result for one question |
| POST | `/api/interviews/:sessionId/complete` | ✅ | `{ durationSeconds? }` | Finalizes score, updates progress tracker |
| GET | `/api/interviews` | ✅ | – | This user's session history |
| GET | `/api/interviews/:sessionId` | ✅ | – | Session detail + all answers |

### Progress
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/progress` | ✅ | Per-category completed/total + percent (for the progress bar) |
| GET | `/api/progress/summary` | ✅ | Overall stats: sessions completed, avg score, totals |

### Example: login → start a mock interview

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@prepwise.com","password":"demo123"}'
# => { "token": "...", "user": { ... } }

curl -X POST http://localhost:5000/api/interviews/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"categorySlug":"javascript","questionCount":5}'
```

## Notes / next steps

- Passwords are hashed with bcrypt; JWTs expire after `JWT_EXPIRES_IN` (default 7 days).
- The mock-interview flow is **self-graded**: the frontend shows the question,
  the user reveals the answer, and reports back whether they got it right via
  `isCorrect`. There's no server-side "grading" of free text.
- `JWT_SECRET` in `docker-compose.yml`/`.env.example` is a placeholder —
  change it before deploying anywhere real.
- No admin endpoints for adding categories/questions yet — they're seeded via
  `seed.sql`. Add an `admin` role + protected POST/PUT/DELETE routes if you
  need to manage content without touching SQL directly.
