import articlesJson from "./articles.json";

export type Article = {
  slug: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string;
};

// Article content lives in articles.json so the CMS (Decap / Pages CMS) can edit it.
export const ARTICLES: Article[] = articlesJson as Article[];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
