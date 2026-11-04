// Server-only logic for netlify/functions/admin-publish.ts. No path aliases so Netlify's bundler resolves it.
export type PublishFile = { path: string; content: string };
export type PublishImage = { path: string; content: string };
export type AdminEnv = { ADMIN_EMAIL?: string; ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; GITHUB_TOKEN?: string; GITHUB_REPO?: string };

export const DEFAULT_ADMIN_EMAIL = 'izzy@theworkoutplant.com';
export const DEFAULT_REPO = 'gypsy247/theworkoutplan-final';
export const SESSION_HOURS = 12;
const CONTENT_PATHS = new Set(['src/data/siteContent.json', 'src/data/articles.json']);
const IMAGE_PATH = /^public\/images\/[a-z0-9-]+\.(png|jpg|webp|gif)$/i;
const encoder = new TextEncoder();

function base64url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}
function safeEqual(a: string, b: string) {
  const left = encoder.encode(a), right = encoder.encode(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i++) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return diff === 0;
}
function sessionSecret(env: AdminEnv) {
  const secret = env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD;
  if (!secret) throw new Error('Admin login is not configured on the server.');
  return secret;
}

export function checkCredentials(env: AdminEnv, email: unknown, password: unknown) {
  if (!env.ADMIN_PASSWORD) throw new Error('Admin login is not configured on the server.');
  if (typeof email !== 'string' || typeof password !== 'string') return false;
  const expected = (env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  return safeEqual(email.trim().toLowerCase(), expected) && safeEqual(password, env.ADMIN_PASSWORD);
}

export async function createSession(env: AdminEnv, now = Date.now()) {
  const payload = base64url(encoder.encode(JSON.stringify({ email: (env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase(), exp: now + SESSION_HOURS * 3600_000 })));
  return `${payload}.${await hmac(sessionSecret(env), payload)}`;
}

export async function verifySession(env: AdminEnv, token: unknown, now = Date.now()) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, await hmac(sessionSecret(env), payload))) return false;
  try {
    const data = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof data.exp === 'number' && data.exp > now && data.email === (env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
  } catch { return false; }
}

export function validatePublishInput(files: unknown, images: unknown): { files: PublishFile[]; images: PublishImage[] } {
  if (!Array.isArray(files) || files.length === 0) throw new Error('No content to publish.');
  const cleanFiles = files.map((file: any) => {
    if (!file || !CONTENT_PATHS.has(file.path) || typeof file.content !== 'string') throw new Error('Invalid content file.');
    JSON.parse(file.content);
    return { path: file.path as string, content: file.content as string };
  });
  const list = Array.isArray(images) ? images : [];
  const cleanImages = list.map((image: any) => {
    if (!image || typeof image.path !== 'string' || !IMAGE_PATH.test(image.path) || typeof image.content !== 'string') throw new Error('Invalid photo filename.');
    return { path: image.path as string, content: image.content as string };
  });
  return { files: cleanFiles, images: cleanImages };
}

type GitRequest = (path: string, method?: string, body?: object) => Promise<any>;
export function githubRequest(env: AdminEnv, fetcher: typeof fetch = fetch): GitRequest {
  if (!env.GITHUB_TOKEN) throw new Error('Publishing is not configured on the server.');
  const repo = env.GITHUB_REPO || DEFAULT_REPO;
  return async (path, method = 'GET', body) => {
    const response = await fetcher(`https://api.github.com/repos/${repo}${path}`, {
      method,
      headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'workout-plant-studio-manager' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) throw new Error(`GitHub request failed [${response.status}]: ${await response.text()}`);
    return response.json();
  };
}

// One tree + commit + non-forced ref update keeps JSON and photos in a single deploy.
export async function commitContent(request: GitRequest, files: PublishFile[], images: PublishImage[], releaseId: string, branch = 'main') {
  const ref = await request(`/git/ref/heads/${branch}`);
  const head = ref.object.sha as string;
  const parent = await request(`/git/commits/${head}`);
  const imageEntries = [];
  for (const image of images) {
    const blob = await request('/git/blobs', 'POST', { content: image.content, encoding: 'base64' });
    imageEntries.push({ path: image.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const tree = await request('/git/trees', 'POST', { base_tree: parent.tree.sha, tree: [
    ...files.map(file => ({ path: file.path, mode: '100644', type: 'blob', content: file.content })),
    ...imageEntries,
    { path: 'public/studio-version.json', mode: '100644', type: 'blob', content: JSON.stringify({ releaseId }) + '\n' },
  ] });
  const commit = await request('/git/commits', 'POST', { message: 'Update site content via Studio Manager', tree: tree.sha, parents: [head] });
  await request(`/git/refs/heads/${branch}`, 'PATCH', { sha: commit.sha, force: false });
  return String(commit.sha);
}
