// Server-only logic for netlify/functions/admin-publish.ts. No path aliases so Netlify's bundler resolves it.
import { publishErrorMessage } from './publish-errors';
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

type GitRequest = (path: string, method?: string, body?: object, raw?: boolean) => Promise<any>;
export class GitHubError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = 'GitHubError'; }
}
export async function fetchRuntimeContent(env: AdminEnv, fetcher: typeof fetch = fetch): Promise<string> {
  if (!env.GITHUB_TOKEN) throw new GitHubError(503, 'Publishing is not configured: set GITHUB_TOKEN on Netlify.');
  const text = await githubRequest(env, fetcher)(`/contents/public/site-content.json?ref=main&t=${Date.now()}`, 'GET', undefined, true);
  JSON.parse(text);
  return text;
}

export function normalizeRepository(value: string | undefined): string {
  const repo = (value || DEFAULT_REPO).trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '').replace(/\.git$/i, '');
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error('GITHUB_REPO must be an owner/repository name or a GitHub repository URL.');
  return repo;
}

export function githubRequest(env: AdminEnv, fetcher: typeof fetch = fetch): GitRequest {
  if (!env.GITHUB_TOKEN) throw new Error('Publishing is not configured on the server. Set GITHUB_TOKEN (and GITHUB_REPO) in the Netlify environment variables.');
  let repo = normalizeRepository(env.GITHUB_REPO);
  let pinned = false;
  const send = (url: string, method = 'GET', body?: object, raw = false) => fetcher(`https://api.github.com${url}`, {
    method, cache: 'no-store',
    headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'User-Agent': 'workout-plant-studio-manager' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const fail = async (response: Response): Promise<never> => { throw new GitHubError(response.status, await response.text()); };
  const recover = async () => {
    // Only recover a missing repository, not a missing file/branch in an accessible one.
    const current = await send(`/repos/${repo}`);
    if (current.ok) { pinned = true; return; }
    if (current.status !== 404) return fail(current);
    if (repo.toLowerCase() !== DEFAULT_REPO.toLowerCase()) {
      const fallback = await send(`/repos/${DEFAULT_REPO}`);
      if (fallback.ok) { repo = DEFAULT_REPO; pinned = true; return; }
      if (fallback.status !== 404) return fail(fallback);
    }
    for (let page = 1; ; page++) {
      const response = await send(`/user/repos?per_page=100&page=${page}`);
      if (!response.ok) return fail(response);
      const repositories = await response.json();
      if (!Array.isArray(repositories)) throw new Error('GitHub returned an unexpected repository list. Please try again.');
      const matches = repositories.filter(item => typeof item?.full_name === 'string' && item.full_name.split('/')[1]?.toLowerCase() === 'theworkoutplan-final');
      if (matches.length > 1) throw new Error('More than one accessible theworkoutplan-final repository was found. Set GITHUB_REPO to the exact owner/repository name.');
      if (matches[0]) { repo = normalizeRepository(matches[0].full_name); pinned = true; return; }
      if (repositories.length < 100) break;
    }
    throw new GitHubError(404, publishErrorMessage(null, 404));
  };
  return async (path, method = 'GET', body, raw = false) => {
    // Resolve before any write, then pin all operations in the atomic commit to that owner.
    if (!pinned && method !== 'GET') await recover();
    let response = await send(`/repos/${repo}${path}`, method, body, raw);
    if (response.status === 404 && !pinned) {
      const previous = repo;
      await recover();
      if (repo !== previous) response = await send(`/repos/${repo}${path}`, method, body, raw);
    }
    if (!response.ok) return fail(response);
    pinned = true;
    return raw ? response.text() : response.json();
  };
}

const IMAGE_TYPES: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };

// Serves an uploaded photo from the (possibly private) repository so raw.githubusercontent.com 404s never reach the browser.
export async function fetchImage(request: GitRequest, path: unknown, branch = 'main'): Promise<{ bytes: Uint8Array; contentType: string }> {
  if (typeof path !== 'string' || !IMAGE_PATH.test(path)) throw new Error('Unknown photo.');
  const file = await request(`/contents/${path}?ref=${branch}`);
  if (typeof file?.content !== 'string') throw new Error('Photo is unavailable.');
  const contentType = IMAGE_TYPES[path.split('.').pop()?.toLowerCase() ?? 'jpg'] ?? 'image/jpeg';
  return { bytes: Uint8Array.from(atob(file.content.replace(/\s/g, '')), (character) => character.charCodeAt(0)), contentType };
}

// Builds the runtime JSON the live site fetches on every page load.
export function buildRuntimeContent(files: PublishFile[]): string {
  const site = files.find((file) => file.path === 'src/data/siteContent.json');
  const blog = files.find((file) => file.path === 'src/data/articles.json');
  if (!site || !blog) throw new Error('Both content files are required to publish.');
  return JSON.stringify({ site: JSON.parse(site.content), blog: JSON.parse(blog.content) });
}

// One tree + commit + non-forced ref update keeps JSON and photos in a single commit.
// [skip ci] tells Netlify not to build: the live site reads public/site-content.json at runtime.
export async function commitContent(request: GitRequest, files: PublishFile[], images: PublishImage[], releaseId: string, branch = 'main') {
  // Preserve atomic source/runtime/image writes; retry with a fresh parent SHA once.
  for (let attempt = 0; attempt < 2; attempt++) {
    try { return await commitAttempt(request, files, images, releaseId, branch); }
    catch (error) {
      if (attempt === 0 && error instanceof GitHubError && (error.status === 409 || (error.status === 422 && /fast.?forward|reference update/i.test(error.message)))) continue;
      throw error;
    }
  }
  throw new Error('Publishing failed.');
}
async function commitAttempt(request: GitRequest, files: PublishFile[], images: PublishImage[], releaseId: string, branch: string) {
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
    { path: 'public/site-content.json', mode: '100644', type: 'blob', content: buildRuntimeContent(files) },
    { path: 'public/studio-version.json', mode: '100644', type: 'blob', content: JSON.stringify({ releaseId }) + '\n' },
  ] });
  const commit = await request('/git/commits', 'POST', { message: 'Update site content via Studio Manager [skip ci]', tree: tree.sha, parents: [head] });
  await request(`/git/refs/heads/${branch}`, 'PATCH', { sha: commit.sha, force: false });
  return String(commit.sha);
}
