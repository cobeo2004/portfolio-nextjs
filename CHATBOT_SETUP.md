# RAG Chatbot Setup Guide

## ✅ Implementation Complete!

All code has been successfully implemented. Now you just need to configure your environment variables and set up the Supabase database.

---

## 📋 **What Was Built**

### **Features Implemented:**
- ✅ RAG-powered chatbot using OpenRouter + Supabase vector store
- ✅ Conversation memory (maintains context within a session)
- ✅ Floating chat button (bottom-right corner)
- ✅ On-demand CV ingestion (automatically triggers on first chat)
- ✅ Rate limiting (10 messages per 15 minutes via Upstash Redis)
- ✅ Relevance filtering (only answers questions about you)
- ✅ Friendly & conversational tone
- ✅ Streaming responses for better UX

### **File Structure Created:**
```
src/
├── lib/
│   ├── supabase.ts           # Supabase client configuration
│   ├── openrouter.ts         # OpenRouter LLM configuration
│   ├── embeddings.ts         # Embedding generation
│   ├── vectorstore.ts        # Supabase vector operations
│   ├── pdf-loader.ts         # CV PDF parsing & chunking
│   └── rate-limit.ts         # Rate limiting logic
├── app/api/
│   ├── ingest/route.ts       # CV ingestion endpoint
│   └── chat/route.ts         # Chat API with RAG
└── components/chatbot/
    ├── ChatButton.tsx        # Floating chat button
    ├── ChatModal.tsx         # Chat modal UI
    ├── ChatMessage.tsx       # Message display
    └── ChatInput.tsx         # Message input
```

---

## 🔧 **Setup Steps (Required)**

### **Step 1: Set Up Supabase Database**

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table for RAG
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx 
ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create similarity search function
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  filter JSONB DEFAULT '{}'::jsonb
) 
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE documents.metadata @> filter
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at 
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

5. Click **Run** to execute the SQL

---

### **Step 2: Get API Keys**

#### **OpenRouter API Key:**
1. Go to https://openrouter.ai/
2. Sign up or log in
3. Go to **Keys** in the sidebar
4. Create a new API key
5. Copy the key (starts with `sk-or-...`)

#### **Supabase Credentials:**
1. In your Supabase project, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **Anon Public Key** (under "Project API keys" → "anon public")
   - **Service Role Key** (under "Project API keys" → "service_role") ⚠️ Keep this secret!

---

### **Step 3: Configure Environment Variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and fill in your credentials:

```env
# Existing variables (keep as is)
NEXT_PUBLIC_SERVICE_ID="your-existing-value"
NEXT_PUBLIC_KEY="your-existing-value"
NEXT_PUBLIC_TEMPLATE_ID="your-existing-value"
NEXT_PUBLIC_README_STATS="your-existing-value"
GITHUB_TOKEN="your-existing-value"
GITHUB_USERNAME="your-existing-value"
UPSTASH_REDIS_REST_TOKEN="your-existing-value"
UPSTASH_REDIS_REST_URL="your-existing-value"

# NEW: OpenRouter Configuration
OPENROUTER_API_KEY="sk-or-your-openrouter-api-key"
OPENROUTER_MODEL="anthropic/claude-3-haiku"

# NEW: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NEW: OpenAI Embeddings (via OpenRouter)
OPENAI_API_KEY="sk-or-your-openrouter-api-key"  # Same as OPENROUTER_API_KEY
EMBEDDING_MODEL="openai/text-embedding-3-small"
```

**Important Notes:**
- `OPENAI_API_KEY` should be the **same** as `OPENROUTER_API_KEY` (OpenRouter is OpenAI-compatible)
- Never commit `.env.local` to git (it's already in `.gitignore`)

---

## 🚀 **Testing the Chatbot**

### **1. Start the Development Server**

```bash
bun dev
```

### **2. Open Your Portfolio**

Navigate to http://localhost:3000

### **3. Click the Floating Chat Button**

You should see a yellow/accent-colored circular button in the bottom-right corner with a chat icon.

### **4. Test Queries**

**Good queries (should work):**
- "What are Simon's skills?"
- "Tell me about Simon's experience"
- "What projects has Simon worked on?"
- "What programming languages does Simon know?"

**Bad queries (should be rejected):**
- "What's the weather like?"
- "Tell me a joke"
- "How do I cook pasta?"

### **5. Test Conversation Memory**

- Ask: "What are his skills?"
- Then ask: "Which one is his strongest?"
- The chatbot should remember the context from the previous question

---

## 🎨 **Choosing Your LLM Model**

You can change the model anytime by updating `OPENROUTER_MODEL` in `.env.local`:

### **Recommended Models:**

| Model | Speed | Cost | Quality | Best For |
|-------|-------|------|---------|----------|
| `anthropic/claude-3-haiku` | ⚡⚡⚡ | $ | ⭐⭐⭐ | **Fast responses (Default)** |
| `openai/gpt-4o-mini` | ⚡⚡ | $$ | ⭐⭐⭐⭐ | Balanced performance |
| `anthropic/claude-3.5-sonnet` | ⚡ | $$$ | ⭐⭐⭐⭐⭐ | Best quality |
| `meta-llama/llama-3.1-70b-instruct` | ⚡⚡ | $ | ⭐⭐⭐⭐ | Open source option |

**To change:**
1. Edit `.env.local`
2. Update `OPENROUTER_MODEL="your-preferred-model"`
3. Restart `bun dev`

---

## 🔧 **Tuning Parameters**

If you want to customize the chatbot behavior, edit these files:

### **Chunk Size & Overlap** (`src/lib/pdf-loader.ts`):
```typescript
chunkSize: 1000,      // ↑ Increase if responses feel fragmented
chunkOverlap: 200,    // ↑ Increase for more context continuity
```

### **Number of Context Documents** (`src/lib/vectorstore.ts`):
```typescript
k: 5,  // ↑ More context, ↓ More focused
```

### **Temperature** (`src/app/api/chat/route.ts`):
```typescript
temperature: 0.7,  // ↑ More creative, ↓ More factual
```

---

## 🐛 **Troubleshooting**

### **"Failed to load knowledge base"**
- Check that you ran the Supabase SQL schema
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase logs for errors

### **"Rate limit exceeded"**
- Wait 15 minutes
- Or adjust rate limit in `src/lib/rate-limit.ts`

### **Chatbot doesn't answer questions about you**
- Wait for first ingestion to complete (automatic on first chat)
- Or manually trigger: `curl -X POST http://localhost:3000/api/ingest`
- Check that `public/assets/pdf/CV.pdf` exists

### **Empty or weird responses**
- Try a different model (see "Choosing Your LLM Model" above)
- Increase temperature for more natural responses
- Check OpenRouter dashboard for API errors

---

## 📊 **API Endpoints**

### **GET /api/ingest**
Check if CV is ingested:
```bash
curl http://localhost:3000/api/ingest
```

### **POST /api/ingest**
Manually ingest CV:
```bash
curl -X POST http://localhost:3000/api/ingest
```

### **DELETE /api/ingest**
Clear all documents (for re-ingestion):
```bash
curl -X DELETE http://localhost:3000/api/ingest
```

### **POST /api/chat**
Send a chat message:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What are Simon'\''s skills?"}
    ]
  }'
```

---

## 🚢 **Deployment Notes**

When deploying to Vercel (or other platforms):

1. **Add environment variables** in the hosting platform dashboard
2. **Ensure Supabase is accessible** from your hosting platform's IPs
3. **Monitor costs** on OpenRouter dashboard
4. **Consider adding** conversation persistence to a database for production use

---

## 🎉 **You're All Set!**

Your RAG-powered chatbot is now ready to use. Enjoy showcasing your portfolio with an interactive AI assistant!

If you have any issues, check the browser console and server logs for error messages.
