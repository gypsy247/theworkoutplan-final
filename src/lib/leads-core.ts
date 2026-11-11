// Server-only lead storage for netlify/functions/admin-publish.ts. No path aliases.
// Leads live in data/leads.json (outside public/) so visitors' contact details are never served publicly.
import { GitHubError } from './admin-publish-core';

export type Lead = { id: string; fullName: string; email: string; phone: string; sessionTier: string; goals: string; smsConsent: boolean; createdAt: string };
export const LEADS_PATH = 'data/leads.json';
type GitRequest = (path: string, method?: string, body?: object, raw?: boolean) => Promise<any>;

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export function validateLead(input: any, now = new Date(), id: string = crypto.randomUUID()): Lead {
  const fullName = text(input?.fullName, 100), email = text(input?.email, 255), phone = text(input?.phone, 40);
  if (!fullName) throw new Error('Please enter your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email.');
  if (phone.replace(/\D/g, '').length < 7) throw new Error('Please enter a valid phone number.');
  return { id, fullName, email, phone, sessionTier: text(input?.sessionTier, 100), goals: text(input?.goals, 2000), smsConsent: input?.smsConsent === true || input?.smsConsent === 'yes', createdAt: now.toISOString() };
}

export function parseLeads(raw: string): Lead[] {
  try { const data = JSON.parse(raw); return Array.isArray(data) ? data : []; } catch { return []; }
}

export async function fetchLeads(request: GitRequest, branch = 'main'): Promise<Lead[]> {
  try { return parseLeads(await request(`/contents/${LEADS_PATH}?ref=${branch}&t=${Date.now()}`, 'GET', undefined, true)); }
  catch (error) { if (error instanceof GitHubError && error.status === 404) return []; throw error; }
}

export async function appendLead(request: GitRequest, lead: Lead, branch = 'main') {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const ref = await request(`/git/ref/heads/${branch}`);
      const head = ref.object.sha as string;
      const parent = await request(`/git/commits/${head}`);
      const leads = [lead, ...(await fetchLeads(request, head)).filter(item => item?.id !== lead.id)];
      const tree = await request('/git/trees', 'POST', { base_tree: parent.tree.sha, tree: [{ path: LEADS_PATH, mode: '100644', type: 'blob', content: JSON.stringify(leads, null, 2) + '\n' }] });
      const commit = await request('/git/commits', 'POST', { message: 'New consultation request [skip ci]', tree: tree.sha, parents: [head] });
      await request(`/git/refs/heads/${branch}`, 'PATCH', { sha: commit.sha, force: false });
      return;
    } catch (error) {
      if (attempt === 0 && error instanceof GitHubError && (error.status === 409 || error.status === 422)) continue;
      throw error;
    }
  }
}
