// Everything the site says about Simon lives here, so copy changes never touch layout code.
// Numbers come from the CV. Clients are described generically unless the work is public.

import { type TGithubRepoInformations } from "@/repositories/github-repo";
import type {
  TAward,
  TCapability,
  TCaseStep,
  TFact,
  TMusic,
  TNavItem,
  TProject,
  TProjectFilter,
  TProjectList,
  TRole,
  TSideProject,
  TSkill,
  TSkillTarget,
  TStackPanel,
  TSuggestedQuestion,
} from "../types";

export const getProjectsData: () => Promise<TProjectList[]> = async () => {
  try {
    const resp = await fetch("/api/repo");
    const data = (await resp.json()) as TGithubRepoInformations;
    return data.map((repo) => ({
      id: repo.id ?? 0,
      name: repo.name ?? "",
      full_name: repo.full_name ?? "",
      description: repo.description ?? "",
      date: repo.updated_at ?? new Date().toISOString(),
      language: repo.language ?? "",
      is_template: repo.is_template ?? false,
      stargazers_count: repo.stargazers_count ?? 0,
      watchers_count: repo.watchers_count ?? 0,
      html_url: repo.html_url ?? "",
      demoLink: repo.html_url ?? "",
    })) as TProjectList[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const siteConfig = {
  name: "Simon Nguyen",
  url: "https://simon-nguyen.space",
  role: "Forward deployed and full-stack engineer",
  city: "Melbourne",
  email: "nxuantuanminh@gmail.com",
  now: "Forward deployed engineer at Teqar, open to full-time roles",
  description:
    "Forward deployed and full-stack engineer in Melbourne building AI agents on solid backends.",
  links: {
    github: "https://github.com/cobeo2004",
    linkedin: "https://www.linkedin.com/in/simon-nguyen-7836822b5/",
    cv: "/assets/pdf/CV.pdf",
    collective: "https://house-of-imaginaries.com/",
  },
};

export const rotatingWords = ["agents", "RAG", "voice AI", "inference"];

export const navItems: TNavItem[] = [
  {
    href: "/",
    key: "home",
    title: "Home",
    sub: "real builds, the numbers, how I work",
  },
  {
    href: "/work",
    key: "work",
    title: "Work",
    sub: "twelve projects, filter by what you need",
  },
  {
    href: "/work/syncnapse",
    key: "case",
    title: "Syncnapse",
    sub: "case study: the voice agent that won",
  },
  {
    href: "/about",
    key: "about",
    title: "About",
    sub: "experience, awards, what I reach for",
  },
  {
    href: "/contact",
    key: "contact",
    title: "Contact",
    sub: "email, a form, or ask my CV",
  },
];

export const factsData: TFact[] = [
  {
    count: 1,
    pre: "Top ",
    suf: "",
    label: "Top 1",
    text: "of 350+ teams at Agentic AI Build Week 2026",
  },
  {
    count: 200,
    pre: "",
    suf: "+ h",
    label: "200+ h",
    text: "of reporting saved each cycle at Arcadian Digital",
  },
  {
    count: 90,
    pre: "",
    suf: "%",
    label: "90%",
    text: "document autofill with under 2% audited error, on-prem",
  },
  {
    count: null,
    pre: "",
    suf: "",
    label: "0.1 ms",
    text: "repeat answers from my Rust inference cache, down from 590 ms",
  },
];

export const stackPanels: TStackPanel[] = [
  {
    slug: "syncnapse",
    meta: "2026 / Voice agent / Hackathon win",
    title: "Sync",
    hl: "napse",
    desc: "An AI teammate that joins live calls, knows when it is spoken to, and turns meetings into company memory a person approves.",
    tags: ["Speech to text", "Turn detection", "Monorepo"],
    nums: [
      { big: "Top 1", small: "of 350+ teams" },
      { big: "3", small: "call platforms: Meet, Teams, Zoom" },
    ],
    cta: { href: "/work/syncnapse", label: "Read case study" },
  },
  {
    slug: "trustlane",
    meta: "2026 / Agent workflows / House of Imaginaries",
    title: "Trust",
    hl: "lane",
    desc: "An AI warranty coordinator for EV dealers. Two bounded agents, compliance checks in plain code, voice calls to technicians, and a person signs every claim.",
    tags: ["Bounded agents", "ElevenLabs", "Source-linked facts"],
    nums: [
      { big: "33", small: "behavioural scenarios passed" },
      { big: "9/9", small: "checks on the final walkthrough" },
    ],
    cta: {
      href: "https://trustlane.house-of-imaginaries.com/",
      label: "Visit the site",
      external: true,
    },
  },
  {
    slug: "document-ai",
    meta: "2025-2026 / On-prem RAG / Client delivery via Teqar",
    title: "Doc",
    hl: "ument",
    after: " AI",
    desc: "A privacy-first multi-agent assistant that assembles technical documents for a WA client, with every filled field traced back to its source page.",
    tags: ["Llama 3.1", "olmOCR", "FAISS", "FastAPI"],
    nums: [
      { big: "80 h", small: "of manual assembly cut to minutes" },
      { big: "<2%", small: "audited error at 90% autofill" },
    ],
  },
  {
    slug: "edge",
    meta: "2026 / Agentic platform / Arcadian Digital",
    title: "",
    hl: "Edge",
    desc: "One data layer over 10+ marketing platforms for 20+ client accounts, used by 15 staff, with AI agents writing the client reports.",
    tags: ["AI agents", "Integrations", "Next.js", "Playwright"],
    nums: [
      { big: "200+ h", small: "saved each reporting cycle" },
      { big: "10+", small: "platforms behind one layer" },
    ],
  },
  {
    slug: "rsdecider",
    meta: "2026 / Inference server / Rust",
    title: "RS",
    hl: "Decider",
    desc: "A Rust inference server for decision models on ONNX Runtime. It coalesces duplicate requests, caches in two tiers, and sheds load before latency climbs.",
    tags: ["Rust", "tokio", "axum", "ONNX Runtime", "Redis"],
    nums: [
      { big: "0.1 ms", small: "repeat answers, from about 590 ms" },
      { big: "100 → 1", small: "identical requests, one model run" },
    ],
  },
  {
    slug: "zero-to-hero",
    meta: "2026 / Product design and build / IBM SkillsBuild concept",
    title: "Zero to ",
    hl: "hero",
    desc: "A manager-first way for teams to learn AI at work: one protected hour a week for four weeks, plus private crews for people changing careers.",
    tags: ["Next.js", "Convex", "IBM Carbon"],
    nums: [
      { big: "1 h", small: "protected each week, set by the manager" },
      { big: "2", small: "tracks: grow in role, change careers" },
    ],
  },
];

export const marqueeIcons = [
  "rust",
  "go",
  "typescript",
  "python",
  "postgresql",
  "redis",
  "openai",
  "anthropic",
  "googlegemini",
  "elevenlabs",
  "onnx",
  "fastapi",
  "nextdotjs",
  "supabase",
  "docker",
  "kubernetes",
] as const;

export const projectsData: TProject[] = [
  {
    slug: "syncnapse",
    title: "Sync",
    hl: "napse",
    meta: "2026 / Voice agent / Hackathon win",
    desc: "An AI teammate that joins live calls, knows when it is spoken to, and turns meetings into company memory a person approves.",
    cats: ["ai"],
    size: "wide",
    thumb: {
      kind: "tile",
      tone: "cobalt",
      big: "Top 1",
      small: "of 350+ teams at Agentic AI Build Week 2026",
    },
    link: { href: "/work/syncnapse", label: "Read case study" },
  },
  {
    slug: "trustlane",
    title: "Trust",
    hl: "lane",
    meta: "2026 / House of Imaginaries",
    desc: "An AI warranty coordinator for EV dealers: bounded agents, plain-code compliance checks, and a person signs every claim.",
    cats: ["ai", "design"],
    size: "half",
    thumb: {
      kind: "image",
      src: "/img/trustlane.webp",
      alt: "TrustLane landing page and claims dashboard",
    },
    link: {
      href: "https://trustlane.house-of-imaginaries.com/",
      label: "Visit the site",
      external: true,
    },
  },
  {
    slug: "zero-to-hero",
    title: "Zero to ",
    hl: "hero",
    meta: "2026 / Product design / IBM SkillsBuild concept",
    desc: "A manager-first way for teams to learn AI at work, one protected hour a week, plus private crews for career changers.",
    cats: ["design", "ai"],
    size: "half",
    thumb: {
      kind: "image",
      src: "/img/zth.webp",
      alt: "From Zero to Hero landing page",
    },
  },
  {
    slug: "document-ai",
    title: "Document AI",
    meta: "2025-2026 / On-prem RAG",
    desc: "Multi-agent document assembly for a WA client, every field traced to its source.",
    cats: ["ai", "backend"],
    size: "third",
    thumb: {
      kind: "tile",
      tone: "ink",
      big: "90%",
      small: "autofill, under 2% audited error, 80 h cut to minutes",
    },
  },
  {
    slug: "edge",
    title: "Edge",
    meta: "2026 / Arcadian Digital",
    desc: "One data layer over 10+ marketing platforms, with agents writing the client reports.",
    cats: ["ai", "backend"],
    size: "third",
    thumb: {
      kind: "tile",
      tone: "soft",
      big: "200+ h",
      small: "saved each reporting cycle",
    },
  },
  {
    slug: "rsdecider",
    title: "RSDecider",
    meta: "2026 / House of Imaginaries / Rust",
    desc: "An ONNX inference server with request coalescing, a two-tier cache and load shedding.",
    cats: ["backend"],
    size: "third",
    thumb: {
      kind: "tile",
      tone: "ink",
      big: "0.1 ms",
      small: "repeat answers, from about 590 ms",
    },
  },
  {
    slug: "dailyos",
    title: "DailyOS",
    meta: "2026 / My own app / Tauri 2",
    desc: "Calendar, tasks, focus and reflection in one place, with a timer in the MacBook notch.",
    cats: ["design"],
    size: "half",
    thumb: {
      kind: "image",
      src: "/img/dailyos.webp",
      alt: "DailyOS Today view",
    },
  },
  {
    slug: "software-factory",
    title: "Software factory",
    meta: "In design / Self-hosted",
    desc: "A board where coding agents plan, build and wait for your approval, on any harness.",
    cats: ["ai", "design"],
    size: "half",
    thumb: {
      kind: "image",
      src: "/img/foundry.webp",
      alt: "Software Factory board",
    },
  },
  {
    slug: "kitsune",
    title: "Kitsune",
    meta: "2026 / Go",
    desc: "Distributed full-text search with gossip membership and checksum-verified S3 snapshots.",
    cats: ["backend"],
    size: "third",
    thumb: {
      kind: "tile",
      tone: "cobalt",
      big: "Search",
      small: "gRPC over Bleve shards, NATS JetStream writes",
    },
    link: {
      href: "https://github.com/cobeo2004",
      label: "On GitHub",
      external: true,
    },
  },
  {
    slug: "scope-eattt",
    title: "Scope Eattt",
    meta: "2026 / House of Imaginaries",
    desc: "Share a code, swipe nearby places together, and the winning lunch spot lands on every screen at once.",
    cats: ["backend"],
    size: "third",
    thumb: {
      kind: "tile",
      tone: "soft",
      big: "Outbox",
      small: "no event lost: Redis and BullMQ relay",
    },
    link: {
      href: "https://github.com/cobeo2004",
      label: "On GitHub",
      external: true,
    },
  },
  {
    slug: "unibuz",
    title: "Unibuz",
    meta: "2025-now / Founding engineer",
    desc: "An AI social platform for students across web, mobile and Supabase.",
    cats: ["ai", "backend"],
    size: "third",
    thumb: {
      kind: "tile",
      tone: "ink",
      big: "40+",
      small: "Edge Functions; Gemini moderation cut manual review 40%",
    },
  },
  {
    slug: "lynn-le",
    title: "Lynn Le",
    meta: "Design and build / Astro, GSAP",
    desc: "A playful portfolio for a business analytics student, folders and all.",
    cats: ["design"],
    size: "wide",
    thumb: {
      kind: "image",
      src: "/img/lynn.webp",
      alt: "Lynn Le portfolio home page",
    },
    link: {
      href: "https://lynnle.vercel.app/",
      label: "Visit the site",
      external: true,
    },
  },
];

export const projectFilters: TProjectFilter[] = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI systems" },
  { key: "backend", label: "Backend" },
  { key: "design", label: "Product and design" },
];

export const experienceData: TRole[] = [
  {
    logo: { src: "/img/logo-arcadian-mark.png", alt: "Arcadian Digital logo" },
    mono: "AD",
    title: "Junior AI Developer",
    org: "Arcadian Digital, Melbourne",
    when: "Mar 2026 - Now",
    points: [
      "Architected Edge, an AI marketing platform joining 10+ platforms behind one data layer for 20+ client accounts and 15 staff.",
      "Built reporting agents that save 200+ hours each reporting cycle.",
      "Hardened RAG chatbots until successful prompt-injection attacks dropped to near zero.",
      "Shipped Next.js features across 8+ client sites with Playwright tests, cutting page load by up to 1.5 s.",
    ],
  },
  {
    logo: { src: "/img/logo-teqar-mark.png", alt: "Teqar logo" },
    mono: "TQ",
    title: "Forward Deployed Engineer",
    org: "Teqar, Perth (contract)",
    when: "Nov 2025 - Now",
    points: [
      "Embedded with a WA client's team: gathered requirements, scoped, and shipped an on-prem multi-agent document assistant.",
      "Cut 80 hours of document assembly to minutes at 90% autofill with under 2% audited error.",
      "Deployed and supported it on the client's own infrastructure, keeping every document inside their network.",
    ],
  },
  {
    logo: { src: "/img/logo-unibuz.svg", alt: "Unibuz logo", fill: true },
    mono: "UB",
    title: "Founding Software Engineer",
    org: "Unibuz, South Yarra (contract)",
    when: "Feb 2025 - Now",
    points: [
      "Built an AI social platform across React web, Expo mobile and Supabase, with 40+ Edge Functions for auth, AI, payments and notifications.",
      "Gemini moderation with database triggers and pgvector recommendations cut manual review by 40%.",
    ],
  },
  {
    mono: "AQ",
    title: "Lead Engineer",
    org: "Aqius Enterprises Atlantis, Glen Huntly",
    when: "Feb 2025 - Nov 2025",
    points: [
      "Led a team of six on a secure audio-logging system across Next.js, Expo, Fastify, Redis, MinIO and Whisper.",
      "Ran planning and code review, and kept stakeholders updated on delivery.",
    ],
  },
  {
    mono: "BG",
    title: "Full-Stack Engineer",
    org: "Ballarat Gold Mine, Ballarat",
    when: "Mar 2024 - Nov 2024",
    points: [
      "Built a Next.js, tRPC and PostgreSQL information system for daily mine operations.",
      "Digitised paper shift logs with OCR and Gemini summaries, removing about 2,000 hours a year of manual entry.",
    ],
  },
];

export const moreProjectsData: TSideProject[] = [
  {
    year: "2026",
    name: "GSC Explorer",
    desc: "Agentic analytics over 431K rows of Search Console data; a durable workflow loads only the days each question needs.",
  },
  {
    year: "2026",
    name: "Trend Analysis RAG",
    desc: "RAG over 27K+ search trends in 84 countries, mixing vector search with structured filters.",
  },
  {
    year: "2026",
    name: "Alya",
    desc: "An LLM localisation CLI for .po files in 11 languages, with a React and Ink terminal UI.",
  },
  {
    year: "2026",
    name: "ProofVault.Tech",
    desc: "Backend and streaming: Redis migration, Go event listeners and LiveKit audio.",
  },
  {
    year: "2025",
    name: "pg-rmq-publisher",
    desc: "Bridges Postgres LISTEN/NOTIFY into RabbitMQ with CPU-aware worker pools.",
  },
  {
    year: "2025",
    name: "MedViệtAI",
    desc: "Solution architecture for a sovereign Vietnamese healthcare LLM. Top 2 of 48+ teams.",
  },
  {
    year: "2025",
    name: "SolarCycleAI",
    desc: "Built in 8 hours at WattTheHack: panel end-of-life forecasts and a truck route optimiser. Top 10.",
  },
  {
    year: "2025",
    name: "YouTube Jam",
    desc: "A watch-together app with sub-second sync of playback, queue and presence over Firebase.",
  },
];

export const awardsData: TAward[] = [
  {
    big: "Top 1",
    title: "Agentic AI Build Week 2026",
    text: "Of 350+ teams, with Syncnapse. Pitched to the judges and led full-stack and AI development.",
    link: "/work/syncnapse",
  },
  {
    big: "Top 2",
    title: "Vietnamese Startup Challenge 2025",
    text: "Of 48+ teams, with MedViệtAI. Solution architect for a sovereign healthcare LLM.",
  },
  {
    big: "Top 10",
    title: "WattTheHack 2025",
    text: "Of 32+ teams, with SolarCycleAI. Built and pitched in 8 hours.",
  },
  {
    big: "BCS",
    title: "Swinburne University of Technology",
    text: "Bachelor of Computer Science, 2023-2025.",
  },
];

export const capabilitiesData: TCapability[] = [
  {
    title: "AI and ML",
    text: "Agents and tool use, multi-agent systems, RAG, FAISS and pgvector, OCR pipelines, voice agents, prompt-injection guardrails, ONNX Runtime.",
  },
  {
    title: "Backend",
    text: "TypeScript, Python, Go, Rust. NestJS, FastAPI, Hono, Fastify, Gin, tRPC, oRPC. RabbitMQ, NATS, BullMQ.",
  },
  {
    title: "Data and infra",
    text: "PostgreSQL, Redis, Prisma, Drizzle, Supabase. Docker, Kubernetes, AWS, Cloudflare, Vercel.",
  },
  {
    title: "Delivery",
    text: "Requirements, live demos, stakeholder updates, Playwright tests, on-prem deployment.",
  },
];

export const skillsData: TSkill[] = [
  {
    label: "LLM agents and tool use",
    to: ["syncnapse", "trustlane", "docai", "edge"],
  },
  { label: "RAG and vector search", to: ["docai", "edge", "unibuz"] },
  { label: "Voice: STT and turn-taking", to: ["syncnapse", "trustlane"] },
  { label: "Go and Rust services", to: ["rsdecider", "kitsune"] },
  { label: "Postgres, Redis, queues", to: ["rsdecider", "kitsune", "unibuz"] },
  { label: "Next.js and Expo", to: ["edge", "unibuz"] },
];

export const skillTargets: TSkillTarget[] = [
  { id: "syncnapse", label: "Syncnapse" },
  { id: "trustlane", label: "TrustLane" },
  { id: "docai", label: "Document AI" },
  { id: "edge", label: "Edge" },
  { id: "rsdecider", label: "RSDecider" },
  { id: "kitsune", label: "Kitsune" },
  { id: "unibuz", label: "Unibuz" },
];

export const suggestedQuestions: TSuggestedQuestion[] = [
  {
    question: "What did you build at Arcadian Digital?",
    fallback:
      "Edge: an AI marketing platform used by 15 staff across 20+ client accounts. It joins 10+ platforms (Meta Ads, Google Ads, GA4, Search Console, Klaviyo and more) behind one data layer, and its reporting agents save 200+ hours each reporting cycle.",
  },
  {
    question: "What is your strongest backend work?",
    fallback:
      "RSDecider, a Rust inference server on ONNX Runtime. Request coalescing runs 100 identical in-flight questions through the model once, a two-tier cache answers repeats in 0.1 ms instead of about 590 ms, and deadline-aware load shedding keeps latency flat when the machine is full.",
  },
  {
    question: "How do you make agents safe for a business?",
    fallback:
      "Models reason, plain code checks the rules, and a person signs off. In TrustLane that meant two bounded agents, deterministic compliance checks and human sign-off on every claim. At Arcadian I hardened RAG chatbots until successful prompt injections dropped to near zero.",
  },
  {
    question: "Are you available?",
    fallback:
      "Yes. I am open to full-time forward deployed and full-stack roles, and to contract work. Email me from the contact page.",
  },
];

export const collectiveData = {
  name: "House of Imaginaries",
  url: "https://house-of-imaginaries.com/",
  blurb:
    "A small collective of curious makers who turn half-asleep what-ifs into things you can hold, click and keep. Everything ships on GitHub first.",
  projects: [
    { name: "TrustLane", stack: "Next.js, Convex, Agents SDK, ElevenLabs" },
    { name: "RSDecider", stack: "Rust, tokio, axum, ONNX Runtime" },
    { name: "Scope Eattt", stack: "SvelteKit, SSE, Postgres, Redis" },
  ],
};

export const caseStudySteps: TCaseStep[] = [
  {
    rail: "Joins",
    title: "Joins the call",
    text: "A meeting bot joins Google Meet, Teams or Zoom like any participant and streams the audio in.",
  },
  {
    rail: "Hears",
    title: "Hears every turn",
    text: "Speech to text and turn detection split the conversation into who said what, and when they finished.",
  },
  {
    rail: "Addressed?",
    title: "Was it spoken to?",
    text: "An addressing router decides whether a turn is meant for the agent. Most of my week went into tuning this one file.",
  },
  {
    rail: "My turn?",
    title: "Is it a good moment?",
    text: "A floor controller holds the reply until speaking would not cut anyone off.",
  },
  {
    rail: "Answers",
    title: "Answers out loud",
    text: "The reply is spoken back into the call. Task routing suggests whether follow-up work goes to a person, an agent or both, with its reasoning.",
  },
  {
    rail: "Remembers",
    title: "Remembers, with approval",
    text: "A slower worker proposes what should become company memory. A person approves it, and permission layers decide who can read it.",
  },
];

export const musicDb = (): TMusic[] => {
  return [
    {
      id: 1,
      name: "Zenzenzense",
      description: "OST of Kimi no Nawa (Your Name)",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/zenzenzense.mp3",
      coverUrl: "/assets/music/cover/your-name.jpg",
    },
    {
      id: 2,
      name: "Nandemonaiya",
      description: "OST of Kimi no Nawa (Your Name)",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/nandemonaiya.mp3",
      coverUrl: "/assets/music/cover/your-name.jpg",
    },
    {
      id: 3,
      name: "Dream Lantern",
      description: "OST of Kimi no Nawa (Your Name)",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/dream-lantern.mp3",
      coverUrl: "/assets/music/cover/your-name.jpg",
    },
    {
      id: 4,
      name: "Sparkle",
      description: "OST of Kimi no Nawa (Your Name)",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/sparkle.mp3",
      coverUrl: "/assets/music/cover/your-name.jpg",
    },
    {
      id: 5,
      name: "Suzume",
      description: "OST of Suzume",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/suzume.mp3",
      coverUrl: "/assets/music/cover/suzume.jpg",
    },
    {
      id: 6,
      name: "Grand Escape",
      description: "OST of Weathering with You",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/grand-escape.mp3",
      coverUrl: "/assets/music/cover/weathering-with-you.jpg",
    },
    {
      id: 7,
      name: "Saraba",
      description: "Opening of Blue Box Season 1",
      artist: "Macaroni Empitsu",
      musicUrl: "/assets/music/song/saraba.mp3",
      coverUrl: "/assets/music/cover/blue-box.jpg",
    },
    {
      id: 8,
      name: "Same blue",
      description: "Opening of Blue Box Season 1",
      artist: "Hige Dandism",
      musicUrl: "/assets/music/song/same-blue.mp3",
      coverUrl: "/assets/music/cover/blue-box.jpg",
    },
    {
      id: 9,
      name: "Pretender",
      description: "Famous song from Hige Dandism",
      artist: "Hige Dandism",
      musicUrl: "/assets/music/song/pretender.mp3",
      coverUrl: "/assets/music/cover/pretender.jpg",
    },
    {
      id: 10,
      name: "Fiction",
      description: "Opening of Wotakoi Season 1",
      artist: "sumika",
      musicUrl: "/assets/music/song/fiction.mp3",
      coverUrl: "/assets/music/cover/wotakoi.jpg",
    },
    {
      id: 11,
      name: "Tracing that dream",
      description: "Another famous song from Yoasobi",
      artist: "Yoasobi",
      musicUrl: "/assets/music/song/tracing-that-dream.mp3",
      coverUrl: "/assets/music/cover/yoasobi.jpg",
    },
    {
      id: 12,
      name: "Fireworks",
      description:
        "Famous song from DAOKO x Kenshi Yonezu, opening of Fireworks, and it’s even more famous than the film itself :)",
      artist: "DAOKO x Kenshi Yonezu",
      musicUrl: "/assets/music/song/fireworks.mp3",
      coverUrl: "/assets/music/cover/fireworks.jpg",
    },
    {
      id: 13,
      name: "Racing into the night",
      description:
        "Most famous song of Yoasobi, if you have not heard it then you don’t know nothing about Japan",
      artist: "Yoasobi",
      musicUrl: "/assets/music/song/racing-into-the-night.mp3",
      coverUrl: "/assets/music/cover/yoasobi.jpg",
    },
    {
      id: 14,
      name: "Setting sun",
      description:
        "Opening of Boku no Kokoro no Yabai Yatsu (The Dangers in My Heart) Season 1",
      artist: "Yorushika",
      musicUrl: "/assets/music/song/setting-sun.mp3",
      coverUrl: "/assets/music/cover/boku-no-yabai-1.jpg",
    },
    {
      id: 15,
      name: "I am",
      description:
        "Opening of Boku no Kokoro no Yabai Yatsu (The Dangers in My Heart) Season 2",
      artist: "Atarayo",
      musicUrl: "/assets/music/song/i-am.mp3",
      coverUrl: "/assets/music/cover/boku-no-yabai-2.jpg",
    },
    {
      id: 16,
      name: "Cinderella",
      description: "Opening of Komi can’t communicate Season 1",
      artist: "Cidergirl",
      musicUrl: "/assets/music/song/cinderella.mp3",
      coverUrl: "/assets/music/cover/komi.jpg",
    },
    {
      id: 17,
      name: "Silhouette",
      description: "The holy anthem of anime world, from opening 16 of Naruto.",
      artist: "Kanaboon",
      musicUrl: "/assets/music/song/silhouette.mp3",
      coverUrl: "/assets/music/cover/naruto.jpg",
    },
    {
      id: 18,
      name: "Harenohini",
      description:
        "The ending theme for Kaoru Hana wa Rin to Saku (The Fragrant Flower Blooms with Dignity)",
      artist: "Reira Ushio",
      musicUrl: "/assets/music/song/harenohini.mp3",
      coverUrl: "/assets/music/cover/kaoru-hana.jpg",
    },
    {
      id: 19,
      name: "Your gaze, Crespucular",
      description:
        "Opening of Kaoru Hana wa Rin to Saku (The Fragrant Flower Blooms with Dignity)",
      artist: "Tatsuya Hikani",
      musicUrl: "/assets/music/song/your-gaze-crespucular.mp3",
      coverUrl: "/assets/music/cover/kaoru-hana.jpg",
    },
    {
      id: 20,
      name: "Blue Bird",
      description:
        "Another holy anthem of anime world, from opening 3 of Naruto.",
      artist: "Ikimonogakari",
      musicUrl: "/assets/music/song/blue-bird.mp3",
      coverUrl: "/assets/music/cover/naruto.jpg",
    },
    {
      id: 21,
      name: "Iris Out",
      description:
        "New generation of holy anthem, from opening of Chainsaw Man - The Movie: Reze Arc",
      artist: "Kenshi Yonezu",
      musicUrl: "/assets/music/song/iris-out.mp3",
      coverUrl: "/assets/music/cover/chainsaw-man.jpg",
    },
    {
      id: 22,
      name: "Love Dramatic",
      description:
        "Opening of Kaguya-sama: Love is War Season 1, crafted by the GOAT Masayuki Suzuki",
      artist: "Masayuki Suzuki",
      musicUrl: "/assets/music/song/love-dramatic.mp3",
      coverUrl: "/assets/music/cover/kaguya-sama.jpg",
    },
    {
      id: 23,
      name: "DADDY-DADDY-DO",
      description:
        "Opening of Kaguya-sama: Love is War Season 2, crafted by the GOAT Masayuki Suzuki",
      artist: "Masayuki Suzuki",
      musicUrl: "/assets/music/song/daddy-daddy-do.mp3",
      coverUrl: "/assets/music/cover/kaguya-sama.jpg",
    },
  ];
};
