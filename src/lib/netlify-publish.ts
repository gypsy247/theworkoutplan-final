import { serializeExports, validateDraft, type EditorDraft } from './admin-content';

export const REPOSITORY = 'gypsy247/theworkoutplan-final';
export const BRANCH = 'main';
export type RepositoryAccess = { kind: 'netlify' | 'github'; token: () => Promise<string> };
export type PendingImage = { path: string; content: string };
export type RepositoryRequest = (path: string, method?: string, body?: object) => Promise<any>;

export function encodeUtf8(value: string) {
  return bytesToBase64(new TextEncoder().encode(value));
}
function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  for (let start = 0; start < bytes.length; start += 8192) binary += String.fromCharCode(...bytes.subarray(start, start + 8192));
  return btoa(binary);
}
export function repositoryRequest(access: RepositoryAccess): RepositoryRequest {
  return async (path, method = 'GET', body) => {
    const token = await access.token();
    if (!token) throw new Error('Sign in before publishing.');
    const base = access.kind === 'netlify' ? '/.netlify/git/github' : `https://api.github.com/repos/${REPOSITORY}`;
    const response = await fetch(`${base}${path}`, {
      method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) {
      const text = await response.text();
      let detail = 'Check your Netlify Identity, Git Gateway and repository permissions.';
      try { const data = JSON.parse(text); detail = data.message || data.error_description || detail; } catch { /* Never render an HTML error page. */ }
      throw new Error(`Repository request failed [${response.status}]: ${detail}`);
    }
    return response.json();
  };
}

export async function getRepositoryHead(request: RepositoryRequest): Promise<string> {
  const ref = await request(`/git/ref/heads/${BRANCH}`);
  if (typeof ref?.object?.sha !== 'string') throw new Error('The repository returned an invalid branch reference.');
  return ref.object.sha;
}

export async function connectRepository(request: RepositoryRequest, deployedContent: EditorDraft): Promise<string> {
  const head = await getRepositoryHead(request);
  for (const file of serializeExports(deployedContent)) {
    const remote = await request(`/contents/src/data/${file.filename}?ref=${encodeURIComponent(head)}`);
    if (typeof remote.content !== 'string') throw new Error('Unable to read the current content files.');
    const bytes = Uint8Array.from(atob(remote.content.replace(/\s/g, '')), character => character.charCodeAt(0));
    if (JSON.stringify(JSON.parse(new TextDecoder().decode(bytes))) !== JSON.stringify(JSON.parse(file.content))) throw new Error('GitHub has newer content than this deployed site. Wait for Netlify to deploy, then reload before publishing.');
  }
  return head;
}

// Git tree + commit + non-forced ref update keeps JSON and images together in one deploy.
export async function publishRepository(request: RepositoryRequest, draft: EditorDraft, expectedHead: string, images: PendingImage[], releaseId: string) {
  const error = validateDraft(draft);
  if (error) throw new Error(error);
  if (await getRepositoryHead(request) !== expectedHead) throw new Error('The repository changed. Reload the latest deployed site before publishing; your draft has not been written.');
  const parent = await request(`/git/commits/${expectedHead}`);
  const treeEntries = serializeExports(draft).map(file => ({ path: `src/data/${file.filename}`, mode: '100644', type: 'blob', content: file.content }));
  const binaryEntries = [];
  for (const image of images) {
    if (!/^public\/images\/[a-z0-9-]+\.(png|jpg|webp|gif)$/i.test(image.path)) throw new Error('Invalid photo filename.');
    const blob = await request('/git/blobs', 'POST', { content: image.content, encoding: 'base64' });
    binaryEntries.push({ path: image.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const tree = await request('/git/trees', 'POST', { base_tree: parent.tree.sha, tree: [...treeEntries, ...binaryEntries, { path: 'public/studio-version.json', mode: '100644', type: 'blob', content: JSON.stringify({ releaseId }) + '\n' }] });
  const commit = await request('/git/commits', 'POST', { message: 'Update site content via Studio Manager', tree: tree.sha, parents: [expectedHead] });
  await request(`/git/refs/heads/${BRANCH}`, 'PATCH', { sha: commit.sha, force: false });
  return { sha: String(commit.sha), url: `https://github.com/${REPOSITORY}/commit/${commit.sha}`, releaseId };
}

export async function prepareImage(file: File): Promise<PendingImage> {
  const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
  const extension = extensions[file.type];
  if (!extension) throw new Error('Choose a JPG, PNG, WebP or GIF image.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Choose a photo smaller than 10 MB.');
  const name = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo';
  return { path: `public/images/${name}-${crypto.randomUUID()}.${extension}`, content: bytesToBase64(new Uint8Array(await file.arrayBuffer())) };
}

export async function isReleaseLive(releaseId: string): Promise<boolean> {
  const response = await fetch(`/studio-version.json?release=${encodeURIComponent(releaseId)}&t=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) return false;
  try { return (await response.json()).releaseId === releaseId; } catch { return false; }
}