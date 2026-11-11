import { checkCredentials, commitContent, createSession, fetchImage, fetchRuntimeContent, GitHubError, githubRequest, validatePublishInput, verifySession, type AdminEnv } from '../../src/lib/admin-publish-core';
import { appendLead, fetchLeads, validateLead } from '../../src/lib/leads-core';
import { publishErrorMessage } from '../../src/lib/publish-errors';

const json = (status: number, body: object) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store, no-cache, must-revalidate' } });

export default async (request: Request) => {
  const env = process.env as AdminEnv;
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    if (action === 'image') {
      try {
        const { bytes, contentType } = await fetchImage(githubRequest(env), url.searchParams.get('path'));
        return new Response(bytes, { status: 200, headers: { 'content-type': contentType, 'cache-control': 'public, max-age=31536000, immutable' } });
      } catch (error) {
        return json(404, { error: publishErrorMessage(error instanceof Error ? error.message : null, error instanceof GitHubError ? error.status : undefined, 'Photo is unavailable.') });
      }
    }
    if (action !== 'content') return json(400, { error: 'Unknown action.' });
    try {
      const content = await fetchRuntimeContent(env);
      return new Response(content, { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store, no-cache, must-revalidate' } });
    } catch (error) {
      return json(error instanceof GitHubError ? error.status : 500, { error: publishErrorMessage(error instanceof Error ? error.message : null, error instanceof GitHubError ? error.status : undefined, 'Live content is unavailable.') });
    }
  }
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  let body: any;
  try { body = await request.json(); } catch { return json(400, { error: 'Invalid request.' }); }
  try {
    if (body?.action === 'login') {
      if (!checkCredentials(env, body.email, body.password)) return json(401, { error: 'Incorrect email or password.' });
      return json(200, { token: await createSession(env) });
    }
    if (body?.action === 'submit-lead') {
      if (body.lead?.['bot-field']) return json(200, { ok: true });
      let lead;
      try { lead = validateLead(body.lead); } catch (error) { return json(400, { error: error instanceof Error ? error.message : 'Invalid request.' }); }
      await appendLead(githubRequest(env), lead);
      return json(200, { ok: true, id: lead.id });
    }
    if (body?.action === 'list-leads') {
      const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
      if (!(await verifySession(env, token))) return json(401, { error: 'Your session expired. Please sign in again.' });
      return json(200, { leads: await fetchLeads(githubRequest(env)) });
    }
    if (body?.action === 'publish') {
      const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
      if (!(await verifySession(env, token))) return json(401, { error: 'Your session expired. Please sign in again.' });
      const { files, images } = validatePublishInput(body.files, body.images);
      const releaseId = typeof body.releaseId === 'string' && /^[\w-]{8,64}$/.test(body.releaseId) ? body.releaseId : crypto.randomUUID();
      const sha = await commitContent(githubRequest(env), files, images, releaseId);
      return json(200, { sha, releaseId });
    }
    return json(400, { error: 'Unknown action.' });
  } catch (error) {
    console.error('admin-publish failed', error);
    return json(error instanceof GitHubError ? error.status : 500, { error: publishErrorMessage(error instanceof Error ? error.message : null, error instanceof GitHubError ? error.status : undefined) });
  }
};
