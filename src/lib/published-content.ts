import type { EditorDraft } from './admin-content';

export const PUBLISHED_CONTENT_KEY = 'workoutplant_published_content';
export function contentTimestamp(content: EditorDraft): number {
  const value = content.site.updatedAt;
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}
export function stampContent(content: EditorDraft, now = Date.now()): EditorDraft {
  return { ...content, site: { ...content.site, updatedAt: Math.max(now, contentTimestamp(content) + 1) } };
}
export function newerContent(server: EditorDraft, local: EditorDraft | null): EditorDraft {
  return local && contentTimestamp(local) > contentTimestamp(server) ? local : server;
}
export function readPublishedContent(): EditorDraft | null {
  try {
    const data = JSON.parse(localStorage.getItem(PUBLISHED_CONTENT_KEY) || 'null');
    if (!data?.site?.hero || !data.site.studioInfo || !Array.isArray(data.site.trainers) || !Array.isArray(data.site.studioPhotos) || !Array.isArray(data.site.appScreenshots) || !Array.isArray(data.blog?.articles)) return null;
    return data;
  } catch { return null; }
}
export function cachePublishedContent(content: EditorDraft): boolean {
  try { localStorage.setItem(PUBLISHED_CONTENT_KEY, JSON.stringify(content)); return true; }
  catch { return false; }
}