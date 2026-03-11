-- Run this in your Vercel Postgres console or psql

-- Enable pgvector extension for user vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- ── PROFILES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT NOT NULL,
  user_type      TEXT NOT NULL CHECK (user_type IN ('student', 'professional')),
  institution    TEXT NOT NULL,
  field          TEXT NOT NULL,
  year           TEXT,                -- students only
  role           TEXT,                -- professionals only
  interests      TEXT[]  DEFAULT '{}',
  avatar_name    TEXT    NOT NULL,
  avatar_emoji   TEXT    NOT NULL,
  vector_seed    JSONB   DEFAULT '{}',  -- initial interest scores
  onboarded_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── USER VECTORS ─────────────────────────────────────────────────────────────
-- public_vec  : updated by interactions with public posts
-- avatar_vec  : updated by interactions with avatar posts
-- Both are 12-dimensional (one per interest + base dims)
CREATE TABLE IF NOT EXISTS user_vectors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  public_vec   vector(12),   -- U_public
  avatar_vec   vector(12),   -- U_avatar
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── POSTS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  identity_mode  TEXT NOT NULL CHECK (identity_mode IN ('public', 'avatar')),
  content        TEXT NOT NULL,
  media_urls     TEXT[]  DEFAULT '{}',
  intent_tags    TEXT[]  DEFAULT '{}',   -- assigned by intent engine
  post_vector    vector(12),             -- post's feature vector for matching
  like_count     INT     DEFAULT 0,
  comment_count  INT     DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── REACTIONS ─────────────────────────────────────────────────────────────────
-- Enforces silo: public users can only react to public posts, avatar to avatar
CREATE TABLE IF NOT EXISTS reactions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id        UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  identity_mode  TEXT NOT NULL CHECK (identity_mode IN ('public', 'avatar')),
  type           TEXT NOT NULL DEFAULT 'like',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, identity_mode)
);

-- Silo enforcement: reaction mode must match post mode
ALTER TABLE reactions ADD CONSTRAINT reaction_silo_check
  CHECK (identity_mode = (SELECT identity_mode FROM posts WHERE id = post_id));

-- ── COMMENTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id        UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  identity_mode  TEXT NOT NULL CHECK (identity_mode IN ('public', 'avatar')),
  content        TEXT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ADD CONSTRAINT comment_silo_check
  CHECK (identity_mode = (SELECT identity_mode FROM posts WHERE id = post_id));

-- ── INSTITUTIONS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS institutions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  type       TEXT NOT NULL CHECK (type IN ('college', 'company')),
  verified   BOOLEAN DEFAULT FALSE,
  country    TEXT DEFAULT 'IN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed popular institutions
INSERT INTO institutions (name, type, verified) VALUES
  ('IIT Delhi', 'college', true),
  ('IIT Bombay', 'college', true),
  ('IIT Madras', 'college', true),
  ('BITS Pilani', 'college', true),
  ('Google', 'company', true),
  ('Microsoft', 'company', true),
  ('Infosys', 'company', true),
  ('TCS', 'company', true)
ON CONFLICT (name) DO NOTHING;

-- ── INDEXES ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_author    ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_mode      ON posts(identity_mode);
CREATE INDEX IF NOT EXISTS idx_posts_created   ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_post  ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post   ON comments(post_id);

-- Vector similarity index (IVFFlat — good for MVP scale)
CREATE INDEX IF NOT EXISTS idx_user_public_vec
  ON user_vectors USING ivfflat (public_vec vector_cosine_ops) WITH (lists = 50);
CREATE INDEX IF NOT EXISTS idx_user_avatar_vec
  ON user_vectors USING ivfflat (avatar_vec vector_cosine_ops) WITH (lists = 50);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vectors ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only update their own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: anyone can read, only owner can write
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (auth.uid() = author_id);

-- Reactions: anyone can read, only owner can write
CREATE POLICY "reactions_select"  ON reactions FOR SELECT USING (true);
CREATE POLICY "reactions_insert"  ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_delete"  ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Comments: anyone can read, only owner can write
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Vectors: only owner can see/update their own
CREATE POLICY "vectors_owner" ON user_vectors USING (auth.uid() = user_id);
