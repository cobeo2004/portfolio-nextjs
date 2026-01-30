export const errors = {
  redisInit: () => new Error("Failed to initialize Redis"),
  supabaseInit: () => new Error("Failed to initialize Supabase clients"),
  pdfNotFound: (path: string) => new Error(`PDF not found: ${path}`),
  pdfReadError: (path: string) => new Error(`Failed to read PDF: ${path}`),
  documentsClear: (msg: string) => new Error(`Failed to clear documents: ${msg}`),
  documentsStore: (msg: string) => new Error(`Failed to store documents: ${msg}`),
  documentsCheck: (msg: string) => new Error(`Failed to check documents: ${msg}`),
  rateLimitExceeded: () => new Error("Rate limit exceeded"),
  rateLimitError: (msg: string) => new Error(`Rate limit error: ${msg}`),
  projectsFetch: (msg: string) => new Error(`Failed to fetch projects: ${msg}`),
  invalidModel: (model: string) => new Error(`Invalid model: ${model}`),
};
