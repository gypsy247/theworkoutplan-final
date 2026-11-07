import { checkCredentials, commitContent, createSession, githubRequest, validatePublishInput, verifySession, type AdminEnv } from '../../src/lib/admin-publish-core';

const json = (status: number, body: object) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export default async (request: Request) => {
  const env = process.env as AdminEnv;
  if (request.method === 'GET') {
    const url = new URL(request.url);
    if (url.searchParams.get('action') !== 'content') return json(400, { error: 'Unknown action.' });
    try {
      const file = await githubRequest(env)('/contents/public/site-content.json?ref=main');
      if (typeof file?.content !== 'string') throw new Error('Live content is unavailable.');
      const content = Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8');
      JSON.parse(content);
      return new Response(content, { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
    } catch (error) {
      return json(404, { error: error instanceof Error ? error.message : 'Live content is unavailable.' });
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
    return json(500, { error: error instanceof Error ? error.message : 'Publishing failed.' });
  }
};
