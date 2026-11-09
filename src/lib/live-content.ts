import { useSyncExternalStore } from "react";
import siteContent from "@/data/siteContent.json";
import articlesContent from "@/data/articles.json";
import { installImageFallback, sanitizeSite } from "@/lib/image-tools";
import { DRAFT_MESSAGE, PREVIEW_READY, isDraftPreview } from "@/lib/draft-preview";

export type LiveContent = { site: typeof siteContent; blog: typeof articlesContent };

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
  current = { site: sanitizeSite((data as LiveContent).site), blog: (data as LiveContent).blog };
  listeners.forEach((callback) => callback());
}

// Pulls the latest published content from the Netlify function, falling back to the raw
// GitHub file, so Studio Manager publishes go live without a site rebuild.
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
  void fetchLive(`/.netlify/functions/admin-publish?action=content&t=${Date.now()}`)
    .catch(() => fetchLive(`https://raw.githubusercontent.com/gypsy247/theworkoutplan-final/main/public/site-content.json?t=${Date.now()}`))
    .catch(() => {
      /* Bundled content stays in place. */
    });
}
