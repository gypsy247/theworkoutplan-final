// Sends one consultation request to Netlify Forms, the Studio leads inbox and an owner email at once.
import { trackMetaEvent } from "./meta-pixel";
export const LEAD_EMAIL = "izzy@theworkoutplant.com";
export type LeadInput = { fullName: string; email: string; phone: string; sessionTier: string; goals: string; smsConsent: boolean; "bot-field"?: string };

export async function submitConsultation(lead: LeadInput, fetcher: typeof fetch = fetch) {
  const consent = lead.smsConsent ? "yes" : "no";
  const form = new URLSearchParams({ "form-name": "consultation-request", "bot-field": lead["bot-field"] ?? "", fullName: lead.fullName, email: lead.email, phone: lead.phone, sessionTier: lead.sessionTier, goals: lead.goals, smsConsent: consent });
  const check = (r: Response) => { if (!r.ok) throw new Error(String(r.status)); return r; };
  const results = await Promise.allSettled([
    fetcher("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form.toString() }).then(check),
    fetcher("/.netlify/functions/admin-publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submit-lead", lead }) }).then(check),
    fetcher(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ _subject: "New Workout Plant Consultation Request!", _template: "table", _captcha: "false", name: lead.fullName, email: lead.email, phone: lead.phone, sessionTier: lead.sessionTier || "Not chosen", goals: lead.goals || "—", smsConsent: consent }) }).then(check),
  ]);
  const delivered = results.filter((r) => r.status === "fulfilled").length;
  if (delivered === 0) throw new Error("We couldn't send your request. Please call or text 917-992-2395.");
  if (!lead["bot-field"]) void trackMetaEvent("Lead", { content_name: "Request a Consultation", content_category: "Personal Training Consultation" }).catch(() => {});
  return delivered;
}
