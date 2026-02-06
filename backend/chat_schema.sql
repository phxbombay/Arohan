
-- Chat Sessions / conversations
CREATE TABLE IF NOT EXISTS chats (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Chat',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chats(chat_id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL, -- 'user' or 'bot' or 'agent'
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- specific actions, links, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster history retrieval
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
