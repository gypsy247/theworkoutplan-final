import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitConsultation } from "@/lib/consultation-submit";

const permission = vi.hoisted(() => ({ allowed: true, choice: null as string | null, changed: () => {} }));
vi.mock("@/lib/consent", () => ({
  canTrack: async () => permission.allowed,
  readChoice: () => permission.choice,
  onConsentChange: (fn: () => void) => { permission.changed = fn; return () => {}; },
}));
async function pixel() {
  const module = await import("@/lib/meta-pixel");
  const calls = vi.fn();
  Object.assign(window, { __workoutPixelBootstrap: () => { window.fbq = calls; } });
  return { ...module, calls };
}
beforeEach(() => {
  vi.resetModules();
  permission.allowed = true; permission.choice = null;
  window.history.replaceState({}, "", "/contact");
  delete window.fbq;
});
describe("Meta pixel events", () => {
  it("sends one PageView for initial hydration and one for a different route", async () => {
    const p = await pixel();
    await Promise.all([p.trackMetaPageView(), p.trackMetaPageView()]);
    window.history.replaceState({}, "", "/pricing");
    await p.trackMetaPageView();
    expect(p.calls.mock.calls.filter(c => c[1] === "PageView")).toHaveLength(2);
  });
  it("does not initialize or send when regional permission is absent", async () => {
    permission.allowed = false;
    const p = await pixel();
    await p.trackMetaPageView(); await p.trackMetaEvent("Contact");
    expect(window.fbq).toBeUndefined(); expect(p.calls).not.toHaveBeenCalled();
  });
  it("a refusal during a pending permission check prevents sending", async () => {
    const p = await pixel();
    const pending = p.trackMetaEvent("Contact");
    permission.choice = "denied";
    await pending;
    expect(p.calls).not.toHaveBeenCalled();
  });
  it("keeps editor pages and URL parameters out of Meta", async () => {
    const p = await pixel();
    for (const path of ["/admin", "/admin/", "/contact?email=test@example.com", "/post/health-detail"]) {
      window.history.replaceState({}, "", path);
      await p.trackMetaPageView(); await p.trackMetaEvent("Lead");
    }
    expect(p.calls).not.toHaveBeenCalled();
  });
  it("booking clicks report interest, never Schedule; phone clicks report Contact", async () => {
    const p = await pixel(); const stop = p.watchMetaActions();
    const button = document.createElement("button"); button.textContent = "Book A Session";
    const link = document.createElement("a"); link.href = "tel:9175550000";
    link.addEventListener("click", e => e.preventDefault());
    document.body.append(button, link); button.click(); link.click();
    await new Promise(resolve => setTimeout(resolve, 0)); stop(); button.remove(); link.remove();
    expect(p.calls.mock.calls.some(c => c[0] === "trackCustom" && c[1] === "BookingInterest")).toBe(true);
    expect(p.calls.mock.calls.some(c => c[1] === "Contact")).toBe(true);
    expect(p.calls.mock.calls.some(c => c[1] === "Schedule")).toBe(false);
  });
  it("revokes without reloading when advertising permission is withdrawn", async () => {
    const p = await pixel(); const stop = p.watchMetaActions();
    await p.trackMetaPageView(); permission.choice = "denied"; permission.changed();
    expect(p.calls).toHaveBeenCalledWith("consent", "revoke"); stop();
  });
  it("reports one Lead after delivery, without contact or goals data", async () => {
    const p = await pixel();
    const { submitConsultation: submit } = await import("@/lib/consultation-submit");
    await submit({ fullName: "Pixel Test", email: "test@example.com", phone: "5550000", goals: "private", sessionTier: "", smsConsent: false }, vi.fn(async () => new Response("{}")));
    await new Promise(resolve => setTimeout(resolve, 0));
    const events = p.calls.mock.calls.filter(c => c[1] === "Lead");
    expect(events).toHaveLength(1);
    expect(events[0]?.[2]).toEqual({ content_name: "Request a Consultation", content_category: "Personal Training Consultation" });
  });
  it("failed delivery never counts a Lead", async () => {
    const p = await pixel();
    await expect(submitConsultation({ fullName: "Test", email: "test@example.com", phone: "555", goals: "", sessionTier: "", smsConsent: false }, vi.fn(async () => { throw new Error("offline"); }))).rejects.toThrow();
    expect(p.calls.mock.calls.some(c => c[1] === "Lead")).toBe(false);
  });
  it("ad blockers cannot throw through event dispatch", async () => {
    const p = await pixel(); await p.trackMetaPageView();
    window.fbq = () => { throw new Error("blocked"); };
    await expect(p.trackMetaEvent("Contact")).resolves.toBeUndefined();
  });
});