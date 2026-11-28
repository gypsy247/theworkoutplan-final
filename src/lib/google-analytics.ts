// Google Analytics 4 for the public site. Page views are sent by the root route on each
// navigation (gtag's own page_view is off so SPA routes are never double counted), and
// key actions are picked up by one delegated listener, the same way meta-pixel.ts works.
export const GA_MEASUREMENT_ID = "G-812LKH9WN4";

// Runs in <head> after consentDefaults, which already defines window.gtag and dataLayer.
export const gaBase = `(function(){if(location.pathname.replace(/\\/$/,"")==="/admin"||window.top!==window.self)return;var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}";document.head.appendChild(s);window.gtag=window.gtag||function(){(window.dataLayer=window.dataLayer||[]).push(arguments)};gtag("js",new Date());gtag("config","${GA_MEASUREMENT_ID}",{send_page_view:false});})();`;

type Params = Record<string, string | number | undefined>;

function enabled() {
  if (typeof window === "undefined") return false;
  // Studio Manager and its same-origin draft previews are not visitors.
  if (window.location.pathname.replace(/\/$/, "") === "/admin" || window.top !== window.self) return false;
  return typeof (window as unknown as { gtag?: unknown }).gtag === "function";
}

export function trackGaEvent(name: string, params: Params = {}) {
  if (!enabled()) return;
  try {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", name, {
      page_path: window.location.pathname,
      ...params,
    });
  } catch {
    /* Tracking must never interrupt the site. */
  }
}

let lastPage = "";

export function trackGaPageView() {
  if (!enabled()) return;
  const path = window.location.pathname;
  if (path === lastPage) return;
  lastPage = path;
  trackGaEvent("page_view", { page_location: window.location.href, page_title: document.title });
}

function locationOf(el: Element): string {
  if (el.closest("#hero-consultation")) return "hero";
  if (el.closest("#consultation")) return "consultation_section";
  if (el.closest("[role=dialog]")) return "booking_dialog";
  if (el.closest("nav, header")) return "navbar";
  if (el.closest("footer")) return "footer";
  const section = el.closest("section[id]");
  return section?.id || window.location.pathname;
}

export function formLocation(form: Element) {
  return locationOf(form);
}

let bookingStarted = "";

function beginBooking(method: string) {
  // Once per page visit, so a scroll or second click inside the calendar is not counted twice.
  if (bookingStarted === window.location.pathname) return;
  bookingStarted = window.location.pathname;
  trackGaEvent("begin_booking", { booking_method: method });
}

export function watchGaActions() {
  if (typeof window === "undefined") return () => {};

  const click = (event: MouseEvent) => {
    const control = event.target instanceof Element ? event.target.closest("a,button") : null;
    if (!control) return;
    const href = control.getAttribute("href") ?? "";
    const text = (control.textContent ?? "").trim().toLowerCase();

    if (/^tel:/i.test(href) || /^sms:/i.test(href)) {
      trackGaEvent("contact_click", { contact_method: /^sms:/i.test(href) ? "sms" : "phone", button_location: locationOf(control) });
    } else if (/^mailto:/i.test(href)) {
      trackGaEvent("contact_click", { contact_method: "email", button_location: locationOf(control) });
    } else if (/acuityscheduling\.com/i.test(href)) {
      beginBooking("acuity_new_tab");
    } else if (/\/book-a-session\b/.test(href) || /book (a|this|your) (session|intro)/.test(text)) {
      const card = control.closest("article");
      trackGaEvent("book_session_click", {
        button_location: card ? "pricing_card" : locationOf(control),
        button_text: text.slice(0, 60),
        tier_name: card?.querySelector("h3")?.textContent?.trim() || undefined,
      });
    }
  };

  // A click inside the cross-origin Acuity iframe moves focus to it, which blurs this window.
  const blur = () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (active instanceof HTMLIFrameElement && /acuityscheduling\.com/i.test(active.src)) beginBooking("acuity_embed");
    }, 0);
  };

  document.addEventListener("click", click, true);
  window.addEventListener("blur", blur);
  return () => {
    document.removeEventListener("click", click, true);
    window.removeEventListener("blur", blur);
  };
}
