-- Migration: Create contact_messages table
-- Date: 2026-04-23
-- Description: Store messages sent via contact form

CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE contact_messages IS 'Messages envoyés via le formulaire de contact';
COMMENT ON COLUMN contact_messages.user_id IS 'ID de l''utilisateur s''il était connecté, NULL sinon';