-- PrepWise database schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- 1. Users (Day 1-2: Login/Auth)
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(120)        NOT NULL,
    email         VARCHAR(160) UNIQUE NOT NULL,
    password_hash TEXT                NOT NULL,
    created_at    TIMESTAMPTZ         NOT NULL DEFAULT now()
);

-- 2. Categories (Day 5-6: Dashboard, e.g. HTML, CSS, JS...)
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(80)  NOT NULL,
    slug        VARCHAR(80)  UNIQUE NOT NULL,
    description TEXT,
    icon        VARCHAR(80),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 3. Questions (Day 7-8: Question page, Q&A + Day 9-10: Mock interview MCQs)
CREATE TABLE IF NOT EXISTS questions (
    id             SERIAL PRIMARY KEY,
    category_id    INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    question       TEXT    NOT NULL,
    answer         TEXT    NOT NULL,
    options        JSONB   NOT NULL DEFAULT '[]',   -- MCQ choices (array of strings)
    correct_option INTEGER,                          -- zero-based index into options
    difficulty     VARCHAR(20) NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Backfill the MCQ columns if an older questions table already exists.
ALTER TABLE questions ADD COLUMN IF NOT EXISTS options        JSONB NOT NULL DEFAULT '[]';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS correct_option INTEGER;

-- 4. Interview sessions (Day 9-10: Mock interview - timer, random Qs, score)
CREATE TABLE IF NOT EXISTS interview_sessions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id      INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    total_questions  INTEGER NOT NULL DEFAULT 0,
    correct_answers  INTEGER NOT NULL DEFAULT 0,
    score_percent    NUMERIC(5,2) NOT NULL DEFAULT 0,
    duration_seconds INTEGER,
    status           VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at     TIMESTAMPTZ
);

-- 5. Interview session answers (each question asked during a session)
CREATE TABLE IF NOT EXISTS interview_session_answers (
    id               SERIAL PRIMARY KEY,
    session_id       UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id      INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    is_correct       BOOLEAN,
    time_taken_secs  INTEGER,
    answered_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Progress tracker (Day 11-12: progress bar, completed count per category)
CREATE TABLE IF NOT EXISTS user_progress (
    id                SERIAL PRIMARY KEY,
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id       INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    completed_count   INTEGER NOT NULL DEFAULT 0,
    total_count       INTEGER NOT NULL DEFAULT 0,
    last_attempt_at   TIMESTAMPTZ,
    UNIQUE (user_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_answers_session ON interview_session_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
