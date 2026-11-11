import { useCallback, useEffect, useState } from "react";
import { Mail, MessageSquare, Phone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ADMIN_ENDPOINT, readError, useStudioSession } from "./StudioSession";

type Lead = { id: string; fullName: string; email: string; phone: string; sessionTier: string; goals: string; smsConsent: boolean; createdAt: string };

export function LeadsPanel() {
  const { token } = useStudioSession();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await fetch(ADMIN_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: "list-leads" }) });
      if (!response.ok) throw new Error(await readError(response, "Unable to load leads."));
      const data = await response.json();
      setLeads([...(data.leads ?? [])].sort((a: Lead, b: Lead) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load leads."); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { void load(); }, [load]);
  const digits = (p: string) => p.replace(/[^\d+]/g, "");
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{leads ? `${leads.length} requests` : "Consultation requests from the website"}</p><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} />Refresh</Button></div>
      {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">{error}</p>}
      {leads?.length === 0 && <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">No consultation requests yet.</p>}
      {leads?.map((lead) => {
        const isNew = Date.now() - new Date(lead.createdAt).getTime() < 48 * 3600_000;
        return (
          <article key={lead.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0"><h3 className="font-display text-lg font-bold">{lead.fullName}</h3><p className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleString()}</p></div>
              <Badge variant={isNew ? "default" : "secondary"}>{isNew ? "New" : "Received"}</Badge>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div className="min-w-0"><dt className="text-xs text-muted-foreground">Email</dt><dd className="break-words">{lead.email}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Phone</dt><dd>{lead.phone}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Session tier</dt><dd>{lead.sessionTier || "Not chosen"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">SMS consent</dt><dd>{lead.smsConsent ? "Yes" : "No"}</dd></div>
              {lead.goals && <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Goals</dt><dd className="whitespace-pre-wrap break-words">{lead.goals}</dd></div>}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm"><a href={`tel:${digits(lead.phone)}`}><Phone />Call</a></Button>
              <Button asChild size="sm" variant="outline"><a href={`sms:${digits(lead.phone)}`}><MessageSquare />Text</a></Button>
              <Button asChild size="sm" variant="outline"><a href={`mailto:${lead.email}?subject=${encodeURIComponent("Your Workout Plant consultation")}`}><Mail />Email</a></Button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
