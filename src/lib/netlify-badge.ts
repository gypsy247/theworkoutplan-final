/**
 * Netlify's edge injects its "Powered by Netlify" badge into every served HTML page on the
 * free plan. The tag is never part of this repository's markup, so the only place to drop
 * it is the live document. The stylesheet hides it instantly; this removes the element so
 * it can never cover a control or swallow a click.
 */

const BADGE_FRAME_IDS = ["nl-badge-frame", "nl-hud-frame"];
const BADGE_FRAME_TITLE = "Powered by Netlify";

function isBadgeFrame(node: Node): node is Element {
  if (node.nodeType !== 1) return false;
  const el = node as Element;
  if (el.tagName !== "IFRAME") return false;
  return BADGE_FRAME_IDS.indexOf(el.id) !== -1 || el.getAttribute("title") === BADGE_FRAME_TITLE;
}

function purge(): void {
  for (const id of BADGE_FRAME_IDS) document.getElementById(id)?.remove();
  for (const frame of document.querySelectorAll(`iframe[title="${BADGE_FRAME_TITLE}"]`)) frame.remove();
  for (const script of document.querySelectorAll("script[data-nf-variant]")) script.remove();
}

let watching = false;

/** Idempotent: safe to call from every page, including the Studio manager. */
export function removeNetlifyBadge(): void {
  if (typeof document === "undefined" || watching) return;
  purge();
  watching = true;
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (isBadgeFrame(node)) node.remove();
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
}
