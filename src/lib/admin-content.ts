import siteContent from "@/data/siteContent.json";
import articlesContent from "@/data/articles.json";

export type SiteContent = typeof siteContent;
export type ArticlesContent = typeof articlesContent;
export type EditorDraft = { site: SiteContent; blog: ArticlesContent };

// This is a convenience screen for public content, not an authorization boundary.
export function isValidEditorPin(pin: string) {
  return /^\d{4}$/.test(pin) && pin === "1390";
}

export function createEditorDraft(): EditorDraft {
  return structuredClone({ site: siteContent, blog: articlesContent });
}

export type DynamicCollection = "pricingTiers" | "trainers" | "faqs" | "reviews" | "studioPhotos" | "appScreenshots";
export function addContentItem(draft: EditorDraft, collection: DynamicCollection): EditorDraft {
  const copy = structuredClone(draft);
  if (collection === "pricingTiers") {
    let id = "new-tier";
    let index = 2;
    while (copy.site.pricingTiers.some((tier) => tier.id === id)) id = `new-tier-${index++}`;
    copy.site.pricingTiers.push({ id, name: "New 1:1 session", price: 0, duration: "1 hour", badge: "", featured: false, description: "", features: [], bookingUrl: "" });
  } else if (collection === "trainers") copy.site.trainers.push({ name: "New trainer", role: "1:1 Personal Trainer", bio: "", quote: "", image: "/images/logo-white.png" });
  else if (collection === "faqs") copy.site.faqs.push({ question: "", answer: "" });
  else if (collection === "reviews") copy.site.reviews.push({ name: "", initials: "", rating: 5, date: "Recent", tag: "Verified Client", text: "", avatarUrl: "" });
  else if (collection === "studioPhotos") copy.site.studioPhotos.push({ image: "", caption: "", category: "clients" });
  else copy.site.appScreenshots.push({ image: "", caption: "" });
  return copy;
}

export function removeContentItem(draft: EditorDraft, collection: DynamicCollection, index: number): EditorDraft {
  const copy = structuredClone(draft);
  if (index < 0 || index >= copy.site[collection].length) throw new Error("Item no longer exists");
  copy.site[collection].splice(index, 1);
  return copy;
}

export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const destination = index + direction;
  if (index < 0 || index >= next.length || destination < 0 || destination >= next.length) return next;
  const [item] = next.splice(index, 1);
  if (item !== undefined) next.splice(destination, 0, item);
  return next;
}

export function updateDraft<T>(draft: T, path: (string | number)[], value: unknown): T {
  const copy = structuredClone(draft);
  let cursor: Record<string | number, unknown> = copy as Record<string | number, unknown>;
  for (const key of path.slice(0, -1)) {
    const next = cursor[key];
    if (!next || typeof next !== "object") throw new Error("Invalid content field");
    cursor = next as Record<string | number, unknown>;
  }
  const last = path.at(-1);
  if (last === undefined) throw new Error("Missing content field");
  cursor[last] = value;
  return copy;
}

export function createArticle(articles: ArticlesContent["articles"]) {
  let slug = "new-article";
  let number = 2;
  while (articles.some((article) => article.slug === slug)) slug = `new-article-${number++}`;
  return { slug, title: "Untitled article", author: "Izzy Jacobus", date: new Date().toISOString().slice(0, 10), readTime: "5 min read", category: "Training", excerpt: "", content: "" };
}

export function validateDraft(draft: EditorDraft): string | null {
  if (draft.site.pricingTiers.some((tier) => !Number.isFinite(tier.price) || tier.price < 0)) return "Enter a valid, non-negative price for every tier.";
  const tierIds = draft.site.pricingTiers.map((tier) => tier.id);
  if (new Set(tierIds).size !== tierIds.length || draft.site.pricingTiers.some((tier) => !tier.id.trim() || !tier.name.trim())) return "Every pricing tier needs a name and unique ID.";
  if (draft.site.faqs.some((faq) => !faq.question.trim() || !faq.answer.trim())) return "Complete the question and answer for every FAQ.";
  if (draft.site.reviews.some((review) => !review.name.trim() || !review.text.trim() || !Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5)) return "Complete every review with a real name, verified quote, and rating from 1 to 5.";
  if ([...draft.site.studioPhotos, ...draft.site.appScreenshots].some((photo) => !photo.caption.trim())) return "Add a caption to every gallery photo.";
  const slugs = new Set<string>();
  for (const article of draft.blog.articles) {
    if (!article.title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) return "Each article needs a title and a lowercase, hyphen-separated URL slug.";
    if (slugs.has(article.slug)) return "Each article must have a unique URL slug.";
    slugs.add(article.slug);
  }
  // Image fields are never a publish blocker; normalizeImages() repairs them at export time.
  return null;
}

const DEFAULT_IMAGE = "/images/trainer-izzy-boxing.jpg";
const VALID_IMAGE = /^(data:image\/|https?:\/\/|\/)\S*/i;
function fixImage(value: unknown, fallback = DEFAULT_IMAGE) {
  return typeof value === "string" && VALID_IMAGE.test(value.trim()) && !value.startsWith("blob:") ? value.trim() : fallback;
}

/** Replaces empty or unusable image references with working /images/ fallbacks. */
export function normalizeImages(site: SiteContent): SiteContent {
  const s = structuredClone(site);
  s.studioInfo.logoImage = fixImage(s.studioInfo.logoImage, "/images/logo-white.png");
  s.trainers.forEach((t) => { t.image = fixImage(t.image); });
  s.studioPhotos.forEach((p) => { p.image = fixImage(p.image); });
  s.appScreenshots.forEach((p) => { p.image = fixImage(p.image, "/images/app-progress-analytics.png"); });
  s.reviews.forEach((r) => { if (r.avatarUrl) r.avatarUrl = fixImage(r.avatarUrl, ""); });
  return s;
}

export function serializeExports(draft: EditorDraft) {
  return [
    { filename: "siteContent.json", content: JSON.stringify(normalizeImages(draft.site), null, 2) + "\n" },
    { filename: "articles.json", content: JSON.stringify(draft.blog, null, 2) + "\n" },
  ];
}

export function downloadJson(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "application/json;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}