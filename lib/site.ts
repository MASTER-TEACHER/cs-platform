/*
 * Public address of the site, used for canonical links, the sitemap and
 * link previews. Set NEXT_PUBLIC_APP_URL in Vercel to override.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://www.csmaster.co.uk"
).replace(/\/+$/, "");

export const siteDescription =
  "Interactive GCSE and A-level Computer Science: curriculum-aligned lessons, quizzes, programming practice, exam training, adaptive revision and AI marking tools for teachers.";

/* Public pages that search engines should index. */
export const publicPages = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/pricing", priority: 0.8 },
  { path: "/teacher-access", priority: 0.7 },
  { path: "/register", priority: 0.6 },
  { path: "/login", priority: 0.5 },
  { path: "/help", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
  { path: "/security", priority: 0.3 },
];
