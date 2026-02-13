-- FUD-Archive Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Topics enum type
CREATE TYPE submission_topic AS ENUM (
  'bubble',
  'scam',
  'environment',
  'obituary',
  'regulation',
  'other'
);

-- Main submissions table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  platform TEXT NOT NULL
    CHECK (platform IN ('twitter', 'reddit', 'youtube', 'facebook', 'linkedin', 'news', 'other')),
  source_date DATE NOT NULL,
  topic submission_topic NOT NULL DEFAULT 'other',
  language TEXT NOT NULL DEFAULT 'en'
    CHECK (language IN ('en', 'de')),
  description TEXT CHECK (char_length(description) <= 280),
  submitted_by_ip INET,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Index for public gallery (approved, sorted by source date)
CREATE INDEX idx_submissions_approved
  ON submissions (source_date DESC)
  WHERE status = 'approved';

-- Index for admin review (pending first)
CREATE INDEX idx_submissions_pending
  ON submissions (created_at ASC)
  WHERE status = 'pending';

-- Composite index for filtered queries
CREATE INDEX idx_submissions_filters
  ON submissions (status, language, platform, topic, source_date DESC);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Public: read approved only
CREATE POLICY "Public can view approved submissions"
  ON submissions FOR SELECT
  USING (status = 'approved');

-- Public: insert new submissions (must be pending)
CREATE POLICY "Anyone can submit"
  ON submissions FOR INSERT
  WITH CHECK (status = 'pending');
