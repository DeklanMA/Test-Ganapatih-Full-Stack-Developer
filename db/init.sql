-- Init SQL untuk database newsfeed
-- Hanya struktur (tables, sequences, constraints), tanpa data

-- ========================
-- TABLE: users
-- ========================
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- TABLE: posts
-- ========================
CREATE TABLE IF NOT EXISTS public.posts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk mempercepat feed
CREATE INDEX IF NOT EXISTS idx_posts_userid_createdat
    ON public.posts (user_id, created_at DESC);

-- ========================
-- TABLE: follows
-- ========================
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    followee_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follows_pkey PRIMARY KEY (follower_id, followee_id),
    CONSTRAINT no_self_follow CHECK (follower_id <> followee_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followee ON public.follows (followee_id);

-- ========================
-- TABLE: user_sessions
-- ========================
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
