import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import { createEditorDraft, validateDraft, type EditorDraft } from './admin-content';

function schemaFrom(value: unknown): z.ZodTypeAny {
  if (typeof value === 'string') return z.string().max(300000);
  if (typeof value === 'number') return z.number().finite();
  if (typeof value === 'boolean') return z.boolean();
  if (Array.isArray(value)) return z.array(value.length ? schemaFrom(value[0]) : z.string()).max(500);
  if (value && typeof value === 'object') return z.object(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, schemaFrom(item)]))).strict();
  return z.null();
}
const contentSchema = schemaFrom(createEditorDraft());
async function github(path: string, key: string, connectorKey: string, method = 'GET', body?: object) {
  const response = await fetch(`https://connector-gateway.lovable.dev/github${path}`, { method, headers: { Authorization: `Bearer ${key}`, 'X-Connection-Api-Key': connectorKey, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  if (!response.ok) {
    const text = await response.text();
    console.error(`GitHub request failed [${response.status}]: ${text}`);
    let message = 'GitHub rejected this request';
    try { message = JSON.parse(text).message ?? message; } catch { /* Keep safe fallback. */ }
    throw new Error(`GitHub [${response.status}]: ${message}`);
  }
  return response.json();
}
export const getPublisher = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: allowed, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (error) throw new Error('Unable to check publishing permission.');
  if (!allowed) return { allowed: false, head: '' };
  const key = process.env['LOVABLE_API_KEY']; const connectorKey = process.env['GITHUB_API_KEY'];
  if (!key || !connectorKey) throw new Error('GitHub publishing connection is not configured on this host.');
  const ref = await github('/repos/gypsy247/screenshot-to-sight-383/git/ref/heads/main', key, connectorKey);
  return { allowed: true, head: String(ref.object.sha) };
});
export const publishStudio = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const parsed = z.object({ draft: contentSchema, expectedHead: z.string().regex(/^[a-f0-9]{40}$/) }).parse(input);
    const draft = parsed.draft as EditorDraft;
    const error = validateDraft(draft); if (error) throw new Error(error);
    if (JSON.stringify(draft).length > 1500000) throw new Error('Content exceeds the publishing size limit.');
    return { draft, expectedHead: parsed.expectedHead };
  }).handler(async ({ data, context }) => {
    const { data: allowed, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (error || !allowed) throw new Error('Only an approved studio owner can publish.');
    const key = process.env['LOVABLE_API_KEY']; const connectorKey = process.env['GITHUB_API_KEY'];
    if (!key || !connectorKey) throw new Error('GitHub publishing connection is not configured on this host.');
    const { commitContent } = await import('./studio-publish.server');
    return commitContent((path, method, body) => github(path, key, connectorKey, method, body), data.draft, data.expectedHead);
  });
export const checkStudioDeployment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ sha: z.string().regex(/^[a-f0-9]{40}$/) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (error || !allowed) throw new Error('Only an approved studio owner can check deployment.');
    const key = process.env['LOVABLE_API_KEY']; const connectorKey = process.env['GITHUB_API_KEY'];
    if (!key || !connectorKey) throw new Error('GitHub publishing connection is not configured on this host.');
    const status = await github(`/repos/gypsy247/screenshot-to-sight-383/commits/${data.sha}/status`, key, connectorKey);
    const { deploymentState } = await import('./studio-publish.server');
    return deploymentState(status.statuses ?? []);
  });
