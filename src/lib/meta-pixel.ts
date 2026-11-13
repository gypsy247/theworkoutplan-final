import { canTrack, onConsentChange, readChoice } from "./consent";

export const META_PIXEL_ID = "28455796424094378";
type PixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: PixelFunction;
  loaded?: boolean;
  version?: string;
};
declare global {
  interface Window { fbq?: PixelFunction; _fbq?: PixelFunction; }
}

// Present in the SSR head, but does not load Meta until advertising is permitted.
export const metaPixelBase = `window.__workoutPixelBootstrap=function(){try{!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(Array.from(arguments))};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');window.fbq?.('set','autoConfig',false,'${META_PIXEL_ID}');window.fbq?.('init','${META_PIXEL_ID}',{}, {agent:'lovable'});}catch(e){}};`;

let initialized = false;
let lastPage = "";
function publicPage() {
  // Never expose editor, draft, account, free-text query or potentially sensitive article URLs.
  return typeof window !== "undefined" && window.self === window.top &&
    !window.location.search && !window.location.hash &&
    !/^\/(admin|membership|client-login|post|disclaimer)(\/|$)/.test(window.location.pathname);
}
function safeCall(...args: unknown[]) {
  try { window.fbq?.(...args); } catch { /* Tracking must never interrupt the site. */ }
}
async function permitted() {
  if (!publicPage()) return false;
  const allowed = await canTrack("advertising");
  if (!allowed || !publicPage() || readChoice("advertising") === "denied") return false;
  if (!initialized) {
    try {
      const bootstrap = (window as Window & { __workoutPixelBootstrap?: () => void }).__workoutPixelBootstrap;
      if (!bootstrap) return false;
      bootstrap();
      initialized = Boolean(window.fbq);
    } catch { return false; }
  }
  if (!initialized) return false;
  safeCall("consent", "grant");
  return true;
}
export async function trackMetaEvent(name: "Lead" | "Contact" | "BookingInterest", parameters: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (!(await permitted()) || path !== window.location.pathname) return;
  safeCall(name === "BookingInterest" ? "trackCustom" : "track", name, parameters, { eventID: crypto.randomUUID() });
}
export async function trackMetaPageView() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (!(await permitted()) || path !== window.location.pathname || lastPage === path) return;
  lastPage = path;
  safeCall("track", "PageView", {}, { eventID: crypto.randomUUID() });
}
export function watchMetaActions() {
  if (typeof window === "undefined") return () => {};
  const click = (event: MouseEvent) => {
    const control = event.target instanceof Element ? event.target.closest("a,button") : null;
    if (!control || !publicPage()) return;
    const href = control.getAttribute("href") ?? "";
    if (/^(tel:|mailto:)/i.test(href)) void trackMetaEvent("Contact");
    else if (/^book (a session|your intro session)$/i.test(control.textContent?.trim() ?? "")) {
      void trackMetaEvent("BookingInterest", { content_name: "Book A Session CTA" });
    }
  };
  document.addEventListener("click", click);
  const unsubscribe = onConsentChange(() => {
    if (readChoice("advertising") === "denied") safeCall("consent", "revoke");
    // Do not replay page views or conversions previously blocked by a refusal.
  });
  return () => { document.removeEventListener("click", click); unsubscribe(); };
}