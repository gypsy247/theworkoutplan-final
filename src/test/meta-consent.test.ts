import { beforeEach, expect, it, vi } from "vitest";

beforeEach(() => { vi.resetModules(); localStorage.clear(); vi.unstubAllGlobals(); });
it("allows an established US visitor without a banner", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(`h=${location.hostname}\nloc=US\n`)));
  const { canTrack } = await import("@/lib/consent");
  expect(await canTrack("advertising")).toBe(true);
});
it("blocks Canada without advertising acceptance", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(`h=${location.hostname}\nloc=CA\n`)));
  const { canTrack } = await import("@/lib/consent");
  expect(await canTrack("advertising")).toBe(false);
});
it("fails closed when the location lookup fails", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
  const { canTrack } = await import("@/lib/consent");
  expect(await canTrack("advertising")).toBe(false);
});
it("Global Privacy Control overrides saved advertising acceptance", async () => {
  localStorage.setItem("cookie_consent_advertising", JSON.stringify({ choice: "granted", at: Date.now() }));
  Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: true });
  const { canTrack } = await import("@/lib/consent");
  expect(await canTrack("advertising")).toBe(false);
  Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: false });
});