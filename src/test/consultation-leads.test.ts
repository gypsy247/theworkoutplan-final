import { describe, expect, it, vi } from "vitest";
import { submitConsultation, LEAD_EMAIL } from "@/lib/consultation-submit";
import { appendLead, validateLead, LEADS_PATH } from "@/lib/leads-core";

const lead = { fullName: "Ana", email: "ana@example.com", phone: "917-555-1234", sessionTier: "Intro", goals: "Strength", smsConsent: true };

describe("consultation form delivery", () => {
  it("sends every request to Netlify Forms, the Studio inbox and izzy@theworkoutplant.com", async () => {
    const fetcher = vi.fn(async () => new Response("{}", { status: 200 }));
    await submitConsultation(lead, fetcher as any);
    const urls = fetcher.mock.calls.map((c: any[]) => c[0]);
    expect(LEAD_EMAIL).toBe("izzy@theworkoutplant.com");
    expect(urls).toEqual(["/__forms.html", "/.netlify/functions/admin-publish", "https://formsubmit.co/ajax/izzy@theworkoutplant.com"]);
    expect((fetcher.mock.calls[0] as any[])[1].body).toContain("form-name=consultation-request");
  });
  it("succeeds when at least one destination receives the lead", async () => {
    const fetcher = vi.fn(async (url: string) => new Response("{}", { status: url.includes("formsubmit") ? 200 : 500 }));
    await expect(submitConsultation(lead, fetcher as any)).resolves.toBe(1);
  });
  it("tells the visitor when nothing was delivered", async () => {
    const fetcher = vi.fn(async () => { throw new Error("offline"); });
    await expect(submitConsultation(lead, fetcher as any)).rejects.toThrow(/couldn't send/);
  });
});

describe("Studio leads storage", () => {
  it("rejects a lead without a valid email", () => {
    expect(() => validateLead({ ...lead, email: "nope" })).toThrow();
  });
  it("stores leads outside the public folder, newest first, in a [skip ci] commit", async () => {
    const calls: any[] = [];
    const request = vi.fn(async (path: string, method = "GET", body?: any) => {
      calls.push({ path, method, body });
      if (path.startsWith("/git/ref/")) return { object: { sha: "head" } };
      if (path.startsWith("/git/commits/")) return { tree: { sha: "t" } };
      if (path.startsWith("/contents/")) return JSON.stringify([{ id: "old", createdAt: "2026-01-01" }]);
      return { sha: "new" };
    });
    await appendLead(request as any, validateLead(lead, new Date("2026-11-11"), "fresh"));
    expect(LEADS_PATH.startsWith("public/")).toBe(false);
    const tree = calls.find((c) => c.path === "/git/trees").body.tree[0];
    expect(JSON.parse(tree.content).map((l: any) => l.id)).toEqual(["fresh", "old"]);
    expect(calls.find((c) => c.path === "/git/commits").body.message).toContain("[skip ci]");
  });
});
