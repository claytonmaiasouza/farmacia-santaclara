-- =============================================
-- Histórico de conversas do chatbot
-- Execute no SQL Editor do Supabase
-- =============================================

CREATE TABLE IF NOT EXISTS chat_sessions (
  id          uuid primary key default uuid_generate_v4(),
  session_id  text not null,           -- phone (whatsapp) ou session_id (site)
  channel     text not null default 'site', -- 'site' ou 'whatsapp'
  role        text not null,           -- 'user' ou 'assistant'
  content     text not null,
  created_at  timestamptz not null default now()
);

CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);
