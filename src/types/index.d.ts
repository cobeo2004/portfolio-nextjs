export type TProjectList = {
  id: number;
  name: string;
  full_name: string;
  description: string;
  date: string;
  language: string;
  is_template: boolean;
  stargazers_count: number;
  watchers_count: number;
  html_url: string;
  demoLink: string;
};

export type TFormValue = {
  name: string;
  email: string;
  message: string;
};
export type TTemplateParams = {
  to_name: string;
  from_name: string;
  reply_to: string;
  message: string;
};

export type TMusic = {
  id: number;
  name: string;
  description: string;
  artist: string;
  musicUrl: string;
  coverUrl: string;
};

// Chatbot types
export type TChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
};

export type TChatSession = {
  id: string;
  messages: TChatMessage[];
  createdAt: Date;
};

export type TDocument = {
  id: string;
  content: string;
  metadata: {
    source?: string;
    page?: number;
    chunk?: number;
    [key: string]: any;
  };
  embedding?: number[];
};

export type TRetrievedDocument = TDocument & {
  similarity: number;
};

// Site content types
export type TTheme = "light" | "dark" | "wizard";

export type TNavItem = {
  href: string;
  key: string;
  title: string;
  sub: string;
};

export type TFact = {
  count: number | null;
  pre: string;
  suf: string;
  label: string;
  text: string;
};

export type TProjectCategory = "ai" | "backend" | "design";

export type TProjectThumb =
  | { kind: "image"; src: string; alt: string }
  | {
      kind: "tile";
      tone: "cobalt" | "ink" | "soft";
      big: string;
      small: string;
    };

export type TProject = {
  slug: string;
  title: string;
  hl?: string;
  meta: string;
  desc: string;
  cats: TProjectCategory[];
  size: "wide" | "half" | "third";
  thumb: TProjectThumb;
  link?: { href: string; label: string; external?: boolean };
};

export type TProjectFilter = {
  key: "all" | TProjectCategory;
  label: string;
};

export type TStackPanel = {
  slug: string;
  meta: string;
  title: string;
  hl: string;
  after?: string;
  desc: string;
  tags: string[];
  nums: { big: string; small: string }[];
  cta?: { href: string; label: string; external?: boolean };
};

export type TRole = {
  logo?: { src: string; alt: string; fill?: boolean };
  mono: string;
  title: string;
  org: string;
  when: string;
  points: string[];
};

export type TSideProject = {
  year: string;
  name: string;
  desc: string;
};

export type TAward = {
  big: string;
  title: string;
  text: string;
  link?: string;
};

export type TCapability = {
  title: string;
  text: string;
};

export type TSkill = {
  label: string;
  to: string[];
};

export type TSkillTarget = {
  id: string;
  label: string;
};

export type TSuggestedQuestion = {
  question: string;
  fallback: string;
};

export type TCaseStep = {
  rail: string;
  title: string;
  text: string;
};
