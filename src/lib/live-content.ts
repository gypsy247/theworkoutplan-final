import { useSyncExternalStore } from "react";
import siteContent from "@/data/siteContent.json";
import articlesContent from "@/data/articles.json";
import { installImageFallback, sanitizeSite } from "@/lib/image-tools";
import { DRAFT_MESSAGE, PREVIEW_READY, isDraftPreview } from "@/lib/draft-preview";
import type { EditorDraft } from './admin-content';
import { cachePublishedContent, newerContent, readPublishedContent } from './published-content';

export type LiveContent = EditorDraft;

// Bundled JSON renders instantly (zero loading flash); the live fetch overrides it in place.
const bundled: LiveContent = { site: siteContent, blog: articlesContent };
let current: LiveContent = bundled;
const listeners = new Set<() => void>();
let started = false;

export function getLiveContent(): LiveContent {
  return current;
}

export function useLiveContent(): LiveContent {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    () => current,
    () => bundled,
  );
}

async function fetchLive(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Live content request failed [${response.status}]`);
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("site" in data) || !("blog" in data)) throw new Error("Live content had an unexpected shape.");
  const content = newerContent(data as LiveContent, newerContent(current, readPublishedContent()));
  applyLiveContent(content);
}

export function applyLiveContent(content: LiveContent) {
  current = { site: sanitizeSite(content.site), blog: content.blog };
  listeners.forEach(callback => callback());
}

export function rememberPublishedContent(content: LiveContent): boolean {
  const cached = cachePublishedContent(content);
  applyLiveContent(content);
  return cached;
}

// Reads the authenticated GitHub API via Netlify, never the stale raw-file CDN.
export function startLiveContentFetch() {
  if (started || typeof window === "undefined") return;
  started = true;
  installImageFallback();
  if (isDraftPreview(window.location.search) && window.parent !== window) {
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== DRAFT_MESSAGE) return;
      const content: LiveContent | undefined = event.data.content;
      if (!content?.site?.hero || !Array.isArray(content.site.pillars) || !Array.isArray(content.blog?.articles)) return;
      current = { ...content, site: sanitizeSite(content.site) };
      listeners.forEach(callback => callback());
    });
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return;
  }
  const local = readPublishedContent();
  if (local) applyLiveContent(newerContent(bundled, local));
  void fetchLive(`/.netlify/functions/admin-publish?action=content&t=${Date.now()}`)
    .catch(() => {
      /* Bundled content stays in place. */
    });
}
