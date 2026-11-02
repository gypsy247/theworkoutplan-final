import type { EditorDraft } from './admin-content';
import { serializeExports } from './admin-content';

export type GithubRequest = (path: string, method?: string, body?: object) => Promise<any>;
export const REPOSITORY = 'gypsy247/screenshot-to-sight-383';
export const BRANCH = 'main';
export async function commitContent(request: GithubRequest, draft: EditorDraft, expectedHead: string) {
  const prefix = `/repos/${REPOSITORY}`;
  const ref = await request(`${prefix}/git/ref/heads/${BRANCH}`);
  if (ref.object.sha !== expectedHead) throw new Error('The repository changed since you connected. Reconnect to review the latest content before publishing.');
  const parent = await request(`${prefix}/git/commits/${expectedHead}`);
  const files = serializeExports(draft);
  const tree = await request(`${prefix}/git/trees`, 'POST', { base_tree: parent.tree.sha, tree: files.map(file => ({ path: `src/data/${file.filename}`, mode: '100644', type: 'blob', content: file.content })) });
  const commit = await request(`${prefix}/git/commits`, 'POST', { message: 'Update studio content from Studio Manager', tree: tree.sha, parents: [expectedHead] });
  await request(`${prefix}/git/refs/heads/${BRANCH}`, 'PATCH', { sha: commit.sha, force: false });
  return { sha: String(commit.sha), url: `https://github.com/${REPOSITORY}/commit/${commit.sha}` };
}
export function deploymentState(statuses: { context: string; state: string; target_url?: string }[]) {
  const netlify = statuses.find(status => /netlify/i.test(status.context));
  if (!netlify) return { state: 'unknown' as const, url: '' };
  return { state: netlify.state === 'success' ? 'live' as const : ['error', 'failure'].includes(netlify.state) ? 'failed' as const : 'pending' as const, url: netlify.target_url ?? '' };
}
