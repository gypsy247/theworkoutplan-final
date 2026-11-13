export const META_PIXEL_ID = "28455796424094378";

type PixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: PixelFunction;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: PixelFunction;
    _fbq?: PixelFunction;
  }
}

// Immediately loads and initializes the Meta Pixel in the SSR <head> on every page load
export const metaPixelBase = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;

let lastPage = "";

function ensurePixelLoaded() {
  if (typeof window === "undefined") return false;
  if (!window.fbq) {
    try {
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq?.("init", META_PIXEL_ID);
    } catch {
      return false;
    }
  }
  return Boolean(window.fbq);
}

function safeCall(...args: unknown[]) {
  try {
    ensurePixelLoaded();
    window.fbq?.(...args);
  } catch {
    /* Tracking must never interrupt the site. */
  }
}

export async function trackMetaEvent(
  name: "Lead" | "Contact" | "BookingInterest" | "Schedule",
  parameters: Record<string, string> = {}
) {
  if (typeof window === "undefined") return;
  const eventName = name === "BookingInterest" ? "Schedule" : name;
  safeCall("track", eventName, parameters);
}

export async function trackMetaPageView() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (lastPage === path) return;
  lastPage = path;
  safeCall("track", "PageView");
}

export function watchMetaActions() {
  if (typeof window === "undefined") return () => {};
  ensurePixelLoaded();

  const click = (event: MouseEvent) => {
    const control = event.target instanceof Element ? event.target.closest("a,button") : null;
    if (!control) return;
    const href = control.getAttribute("href") ?? "";
    const text = (control.textContent?.trim() ?? "").toLowerCase();

    if (/^(tel:|mailto:)/i.test(href)) {
      void trackMetaEvent("Contact");
    } else if (text.includes("request my consultation")) {
      void trackMetaEvent("Lead", {
        content_name: "Request a Consultation",
        content_category: "Personal Training Consultation",
      });
    } else if (text.includes("book a session") || text.includes("book your intro")) {
      void trackMetaEvent("Schedule", { content_name: "Book A Session CTA" });
    }
  };

  const submit = () => {
    void trackMetaEvent("Lead", {
      content_name: "Request a Consultation",
      content_category: "Personal Training Consultation",
    });
  };

  document.addEventListener("click", click, true);
  document.addEventListener("submit", submit, true);

  return () => {
    document.removeEventListener("click", click, true);
    document.removeEventListener("submit", submit, true);
  };
}
