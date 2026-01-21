# Simon Nguyen's Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61dafb)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.165.0-white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38b2ac)](https://tailwindcss.com/)

A modern, interactive personal portfolio website built with **Next.js 16**, **React 19**, **Three.js**, and **TypeScript**. Features interactive 3D models, an AI-powered chatbot, music player, GitHub project integration, and a responsive design.

Heavily adopted from: [CodeBucks: Build an Amazing Personal Portfolio Website with Next.js, Three.js & Tailwind CSS](https://www.youtube.com/watch?v=T5t46vuW8fo&t=217s)

## ✨ Key Features

### 🎨 **Interactive 3D Graphics**

- **Animated 3D Models** - Three.js-powered wizard, staff, and hat models with smooth animations
- **@react-three/fiber** - React renderer for Three.js with performance optimizations
- **Environment Lighting** - "Dawn" preset for realistic lighting
- **SSR Safe** - Dynamic imports with `ssr: false` to prevent hydration issues

### 🧭 **Smart Navigation**

- **Circular Navigation** - Desktop: rotating circular nav around center point
- **Responsive Layouts** - Tablet: vertical linear layout, Mobile: 2-column flex
- **Smooth Animations** - Stagger effects with Framer Motion
- **Quick Links** - Home, About, Projects, Contact, GitHub, LinkedIn, Instagram, Resume

### 🎵 **Music Player**

- **23 Anime OST Tracks** - Curated collection from Your Name, Weathering with You, Suzume, and more
- **Full Controls** - Play/Pause, Skip, Volume, Shuffle, and Repeat-One modes
- **Visual Playlist** - Album covers with active track highlighting
- **Auto-play Consent** - Modal-based browser autoplay handling
- **Session Persistence** - Remembers playback state for 3 days

**Featured Artists**:

- Radwimps (Your Name, Weathering with You)
- Yoasobi (Racing into the Night)
- Kenshi Yonezu (Fireworks, Iris Out)
- Hige Dandism (Pretender)
- Various anime openings (Naruto, Chainsaw Man, Blue Box, etc.)

### 🤖 **AI-Powered Chatbot (RAG)**

- **Retrieval-Augmented Generation** - Semantic search over CV content
- **Context-Aware Responses** - Maintains conversation history
- **Real-time Streaming** - Responses stream character-by-character
- **Rate Limiting** - 10 messages per 15 minutes per IP address
- **Off-topic Detection** - Keyword-based relevance filtering
- **Auto-Ingestion** - Automatically loads CV on first chat

**Tech Stack**:

- LLM: OpenRouter (Claude, GPT-4o mini, Llama, Mistral)
- Vector DB: Supabase pgvector
- Embeddings: OpenAI text-embedding-3-small
- Text Processing: LangChain.js
- Rate Limiting: Upstash Redis

### 📊 **GitHub Projects Integration**

- **Live Repository Sync** - Fetches latest projects from GitHub API
- **Smart Caching** - 30-minute Redis cache to minimize API calls
- **Project Cards** - Display repo name, description, stars, watchers, language, update date
- **Template Detection** - Highlights GitHub template repositories
- **Direct GitHub Links** - Click to view source code
- **Rate Limiting** - Per-IP rate limiting to prevent abuse

### 📧 **Contact Form with EmailJS**

- **Real-time Validation** - Name (3+ chars), Email, Message (50-256 chars)
- **Toast Notifications** - Success/error feedback with Sonner
- **Glassmorphism Design** - Modern semi-transparent UI with backdrop blur
- **React Hook Form** - Efficient form state management
- **Email Delivery** - Configurable EmailJS templates

### 📈 **About Page with GitHub Stats**

- **GitHub Contribution Calendar** - Visual contribution history
- **GitHub Stats Widget** - Top languages, commit activity, contributions
- **Skill Icons** - 60+ technology badges
- **Bio & Education** - Personal information and background
- **External Stats API** - Powered by GitHub Readme Stats

### ✨ **Animated Background**

- **Firefly Particles** - Randomly appearing floating particles
- **Glow Effects** - Yellow/white radial gradient glow
- **Continuous Animation** - New particles every 3 seconds
- **Full-page Coverage** - Fixed positioning across all routes

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Package Manager**: npm, yarn, pnpm, or bun (bun recommended)

### Installation & Development

```bash
# Install dependencies
bun install
# or npm install

# Start development server (http://localhost:3000)
bun dev
# or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Build for Production

```bash
# Build the project
bun run build

# Start production server
bun start
```

## 🤖 AI Chatbot Setup Guide

The portfolio includes an intelligent AI chatbot powered by RAG (Retrieval-Augmented Generation) that answers questions about you using your CV as context.

### Prerequisites

1. **Supabase Account** - [Create free account](https://supabase.com)
   - Vector database support (pgvector extension)
   - PostgreSQL with pgvector for semantic search

2. **OpenRouter API Key** - [Get key](https://openrouter.ai)
   - LLM access (Claude, GPT-4o, Llama, etc.)
   - Supports multiple models with unified API

3. **OpenAI API Key** - [Get key](https://platform.openai.com/api-keys)
   - For text embeddings (text-embedding-3-small)
   - Can be accessed via OpenRouter

4. **Upstash Redis** - [Create account](https://upstash.com)
   - Serverless Redis for rate limiting and caching

### Quick Setup (5 minutes)

**Step 1: Setup Supabase Vector Store**

1. Go to [Supabase](https://supabase.com) and create a new project
2. Enable pgvector extension: SQL Editor → New Query → Run from `CHATBOT_SETUP.md`
3. Note your `Project URL` and create an `anon key`

**Step 2: Get API Keys**

- OpenRouter: [https://openrouter.ai](https://openrouter.ai) → Dashboard → Create Key
- OpenAI: [https://platform.openai.com](https://platform.openai.com) → API Keys → Create
- Upstash: [https://upstash.com](https://upstash.com) → Redis → Create DB

**Step 3: Configure Environment Variables**

Create `.env.local` in the project root:

```bash
# AI Chatbot - OpenRouter (LLM)
OPENROUTER_API_KEY=sk-or-YOUR_KEY_HERE
OPENROUTER_MODEL=openai/gpt-4o-mini

# Database - Supabase (Vector Store)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Embeddings - OpenAI (via OpenRouter)
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
EMBEDDING_MODEL=text-embedding-3-small

# Rate Limiting - Upstash Redis
UPSTASH_REDIS_REST_URL=https://YOUR_REGION.upstash.io
UPSTASH_REDIS_REST_TOKEN=YOUR_REDIS_TOKEN

# GitHub Projects
GITHUB_TOKEN=ghp_YOUR_GITHUB_TOKEN
GITHUB_USERNAME=your_github_username

# Contact Form - EmailJS
NEXT_PUBLIC_SERVICE_ID=service_xxxxxxxxx
NEXT_PUBLIC_TEMPLATE_ID=template_xxxxxxxxx
NEXT_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY
```

**Step 4: Start Development**

```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) and click the floating chat button!

### How the Chatbot Works

The RAG pipeline consists of 7 steps:

```
1. User asks question
        ↓
2. Query relevance check (keyword filtering)
        ↓
3. Convert query to vector embedding
        ↓
4. Semantic search in Supabase pgvector
        ↓
5. Retrieve top 5 relevant CV chunks
        ↓
6. Generate response using LLM + context
        ↓
7. Stream response character-by-character
```

**Key Features**:

- **Conversation Memory** - Maintains chat history for context
- **Semantic Search** - Finds relevant information using embeddings
- **Smart Filtering** - Rejects off-topic queries gracefully
- **Rate Limiting** - 10 messages per 15 minutes per IP
- **Auto-Ingestion** - CV automatically loaded on first chat
- **Real-time Streaming** - Response appears as it's generated

### API Endpoints

#### `POST /api/chat`

Send a message to the chatbot

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Tell me about your experience"}
    ]
  }'
```

#### `POST /api/ingest`

Manually trigger CV ingestion

```bash
curl -X POST http://localhost:3000/api/ingest
```

#### `GET /api/ingest`

Check ingestion status

```bash
curl http://localhost:3000/api/ingest
```

#### `DELETE /api/ingest`

Clear ingested documents (for re-ingestion)

```bash
curl -X DELETE http://localhost:3000/api/ingest
```

### Customization

Modify chatbot behavior in `src/app/api/chat/route.ts`:

```typescript
// Change the system prompt (lines 18-25)
const systemPrompt = "Your custom instructions here...";

// Adjust relevance keywords (line 19)
const offTopicKeywords = ["word1", "word2"];

// Fine-tune LLM parameters
const temperature = 0.7; // Creativity (0-1)
const max_tokens = 1024; // Response length
const top_p = 0.9; // Nucleus sampling
```

### Models Supported

OpenRouter supports 100+ models. Popular choices:

| Model                         | Speed  | Cost | Quality   | Recommended For        |
| ----------------------------- | ------ | ---- | --------- | ---------------------- |
| `openai/gpt-4o-mini`          | Fast   | $    | High      | **General use**        |
| `anthropic/claude-3.5-sonnet` | Medium | $$   | Excellent | Complex questions      |
| `meta-llama/llama-3.1-405b`   | Medium | $    | Very Good | Open source preference |
| `google/gemini-pro`           | Fast   | $    | Good      | Balance of speed/cost  |

See [OpenRouter Models](https://openrouter.ai/docs/models) for full list and pricing.

### Troubleshooting

**"Chatbot not responding"**

- Check `.env.local` has all required keys
- Verify Supabase SQL schema is created
- Check OpenRouter API key is valid

**"Rate limit exceeded"**

- Wait 15 minutes before next message
- Adjust limit in `src/lib/rate-limit.ts`

**"No response or slow response"**

- Try a different model in `OPENROUTER_MODEL`
- Check network in browser DevTools
- Verify Supabase connection

See `CHATBOT_SETUP.md` and `CHATBOT_FIX.md` for detailed troubleshooting.

## 📊 GitHub Projects Integration

The portfolio automatically fetches and displays your latest GitHub repositories.

### Setup

Add to `.env.local`:

```bash
GITHUB_TOKEN=ghp_YOUR_GITHUB_TOKEN        # Personal access token
GITHUB_USERNAME=your_github_username       # Your GitHub username
UPSTASH_REDIS_REST_URL=...                # Redis for caching
UPSTASH_REDIS_REST_TOKEN=...
```

### How It Works

```
User visits /projects
        ↓
Check Redis cache (30 min TTL)
        ↓ (if expired)
Fetch GitHub API (/repos)
        ↓
Parse & validate with Zod
        ↓
Cache in Redis
        ↓
Display in grid
```

### Features

- **Live Updates** - Shows latest repos from GitHub
- **Smart Caching** - 30-minute cache to reduce API calls
- **Project Info** - Name, description, language, stars, watchers, update date
- **Template Detection** - Highlights template repositories
- **Direct Links** - Click to view repo on GitHub
- **Responsive Grid** - 1 column mobile, 2 columns desktop
- **Rate Limiting** - Per-IP protection against abuse

## 🎵 Music Player Guide

### How to Add Your Music

1. **Add MP3 files** to `public/assets/music/song/`
2. **Add album covers** (512x512px) to `public/assets/music/cover/`
3. **Update** `src/lib/data.ts` with new tracks:

```typescript
{
  id: 24,
  name: "Song Title",
  artist: "Artist Name",
  description: "Optional description",
  musicUrl: "/assets/music/song/filename.mp3",
  coverUrl: "/assets/music/cover/filename.jpg",
}
```

### Features

- **23 Anime OSTs** - Curated collection included
- **Play Controls** - Play, Pause, Skip Previous/Next
- **Volume Control** - Slider with mute button
- **Shuffle Mode** - Randomize playback order
- **Repeat One** - Loop current track
- **Playlist View** - See all songs with covers
- **Session Persistence** - Remembers last played track

## 📧 Contact Form

The contact form is powered by EmailJS, allowing visitors to send you messages directly.

### Setup EmailJS

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Create email service (e.g., Gmail)
3. Create email template
4. Get Service ID, Template ID, and Public Key

Add to `.env.local`:

```bash
NEXT_PUBLIC_SERVICE_ID=service_xxxxxxxxx
NEXT_PUBLIC_TEMPLATE_ID=template_xxxxxxxxx
NEXT_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY
```

### Features

- **Real-time Validation** - Instant feedback on input errors
- **Toast Notifications** - Success/error messages
- **Rate Limiting** - Prevents spam submissions
- **Responsive Design** - Works on all devices

## 🎨 Customization

### Theme & Colors

Modify CSS variables in `src/app/globals.css`:

```css
:root {
  --background: 27 27 27; /* Main background (dark gray) */
  --foreground: 225 225 225; /* Main text (light gray) */
  --muted: 115 115 115; /* Secondary text (gray) */
  --accent: 254 254 91; /* Primary interactive (yellow) */
}
```

### Tailwind Configuration

Customize in `tailwind.config.ts`:

- Custom colors
- Screen breakpoints (xs: 480px for mobile)
- Animation presets (spin-slow, spin-slow-rev)
- Shadow utilities (glass effects)

### Navigation Items

Edit `src/lib/data.ts` to customize:

- Navigation links and order
- External URLs (GitHub, LinkedIn, etc.)
- Resume download link

## 📁 Project Structure

```
portfolio/
├── public/
│   └── assets/
│       ├── background/        # Page background images
│       ├── models/            # 3D .glb files (wizard, staff, hat)
│       ├── music/
│       │   ├── song/          # 23 MP3 audio files
│       │   └── cover/         # Album artwork
│       ├── pdf/               # CV.pdf for chatbot
│       └── audio/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Sound, ChatButton, Background)
│   │   ├── page.tsx           # Home page (/)
│   │   ├── globals.css        # Global styles & CSS variables
│   │   ├── api/
│   │   │   ├── chat/route.ts         # POST /api/chat
│   │   │   ├── ingest/route.ts       # POST/GET/DELETE /api/ingest
│   │   │   └── repo/route.ts         # GET /api/repo (GitHub)
│   │   └── (sub-pages)/       # Route group (no URL segment)
│   │       ├── about/page.tsx        # /about page
│   │       ├── projects/page.tsx     # /projects page
│   │       └── contact/page.tsx      # /contact page
│   ├── components/
│   │   ├── navigation/        # Circular/responsive navigation
│   │   ├── models/            # 3D model components
│   │   ├── Sounds/            # Music player UI
│   │   ├── chatbot/           # Chat UI components
│   │   ├── ProjectList/       # GitHub projects grid
│   │   ├── contact/           # Contact form
│   │   ├── About/             # About section
│   │   ├── background/        # Firefly animation
│   │   └── buttons/           # Navigation & action buttons
│   ├── hooks/
│   │   ├── useSounds.ts       # Music player state
│   │   ├── useGetProjects.ts  # GitHub projects fetch
│   │   └── useFormEmailSubmit.ts # Contact form handling
│   ├── lib/
│   │   ├── data.ts            # Navigation & music database
│   │   ├── env.ts             # Environment validation
│   │   ├── vectorstore.ts     # Vector DB operations
│   │   ├── embeddings.ts      # Embedding generation
│   │   ├── openrouter.ts      # OpenRouter LLM client
│   │   ├── supabase.ts        # Supabase client
│   │   ├── rate-limit.ts      # Upstash rate limiting
│   │   └── query-client.ts    # React Query configuration
│   ├── types/
│   │   └── index.d.ts         # TypeScript definitions
│   ├── providers/
│   │   └── QueryProvider.tsx  # React Query provider
│   └── utils/
│       └── get-ip.ts          # IP extraction utility
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies & scripts
├── CHATBOT_SETUP.md           # Detailed chatbot setup
├── CHATBOT_FIX.md             # Chatbot architecture & fixes
└── README.md                  # This file
```

## 🛠️ Tech Stack

### Frontend

- **React 19.2.3** - UI library
- **Next.js 16.1.1** - React framework with App Router
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **Framer Motion 11.18.2** - Smooth animations & transitions

### 3D Graphics

- **Three.js 0.165.0** - 3D graphics library
- **@react-three/fiber 9.5.0** - React renderer for Three.js
- **@react-three/drei 9.122.0** - Useful Three.js helpers & presets

### AI & LLM

- **OpenRouter** - Unified LLM API (Claude, GPT-4o, Llama, etc.)
- **LangChain.js** - AI orchestration & text processing
- **Supabase pgvector** - Vector database for embeddings
- **OpenAI Embeddings** - text-embedding-3-small

### Forms & Validation

- **React Hook Form 7.71.1** - Efficient form state management
- **Zod 4.3.5** - TypeScript-first schema validation
- **EmailJS** - Email delivery from client-side

### Data & Caching

- **@tanstack/react-query 5.90.19** - Server state management
- **Upstash Redis** - Serverless Redis for caching & rate limiting

### Utilities

- **Sonner 1.7.4** - Toast notifications
- **Lucide React 0.396.0** - Icon library
- **clsx 2.1.1** - Conditional className utility

## 📊 Environment Variables

### Required for Core Features

```bash
# Music Player (optional - uses defaults)
# No environment variables needed

# Contact Form - EmailJS
NEXT_PUBLIC_SERVICE_ID=service_xxx
NEXT_PUBLIC_TEMPLATE_ID=template_xxx
NEXT_PUBLIC_KEY=emailjs_public_key

# GitHub Projects
GITHUB_TOKEN=ghp_xxx
GITHUB_USERNAME=your_username
UPSTASH_REDIS_REST_URL=https://your.upstash.io
UPSTASH_REDIS_REST_TOKEN=token

# AI Chatbot (optional but recommended)
OPENROUTER_API_KEY=sk-or-xxx
OPENROUTER_MODEL=openai/gpt-4o-mini
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
OPENAI_API_KEY=sk-xxx
EMBEDDING_MODEL=text-embedding-3-small
UPSTASH_REDIS_REST_URL=https://your.upstash.io
UPSTASH_REDIS_REST_TOKEN=token
```

See `.env.example` for the complete template.

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Connect GitHub repo at https://vercel.com
# Add environment variables in Vercel dashboard
# Push to main branch to deploy automatically
git push origin main
```

### Docker

**Building locally:**

```bash
docker build -t portfolio-nextjs -f ./Dockerfile .
docker run -p 3000:3000 portfolio-nextjs
```

**Using docker-compose:**

```bash
docker-compose up -d
```

**Pulling from Docker Hub:**

```bash
docker pull cobeo2004/portfolio-nextjs:production
docker run -p 3000:3000 cobeo2004/portfolio-nextjs:production
```

## 📚 Documentation

- **[Vercel AI SDK](https://sdk.vercel.ai)** - AI integration documentation
- **[OpenRouter API](https://openrouter.ai/docs)** - LLM provider documentation
- **[Supabase Docs](https://supabase.com/docs)** - Vector database setup

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **CodeBucks** - [YouTube Tutorial](https://www.youtube.com/watch?v=T5t46vuW8fo&t=217s) that inspired the initial design
- **Three.js Community** - 3D graphics tutorials and examples
- **OpenAI** - Embeddings model (accessed via OpenRouter)
- **Vercel** - Next.js framework and AI SDK
- **Supabase** - Vector database infrastructure

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📞 Support

- 📧 Contact: nxuantuanminh@gmail.com
- 🐙 GitHub: [cobeo2004](https://github.com/cobeo2004/)
- 💼 LinkedIn: [Simon Nguyen](https://www.linkedin.com/in/simon-nguyen-7836822b5/)

## 🔄 Development Workflow

### Running Tests (if configured)

```bash
bun test
# or npm test
```

### Linting & Type Checking

```bash
# Lint code
bun run lint

# Type check without building
tsc --noEmit

# Full build with type checking
bun run build
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## 📈 Performance Optimization Tips

1. **Lazy load 3D models** - Already using dynamic imports with `ssr: false`
2. **Cache API responses** - GitHub projects cached for 30 minutes
3. **Optimize images** - Compress album covers and backgrounds
4. **Monitor bundle size** - Use `next/bundle-analyzer` if needed
5. **Rate limiting** - Prevents overload from chatbot and projects API

---

**Made with ❤️ by Simon Nguyen**

Last Updated: January 2026
