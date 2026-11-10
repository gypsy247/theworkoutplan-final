import { describe, it, expect, vi } from 'vitest';
import { checkCredentials, createSession, verifySession, validatePublishInput, buildRuntimeContent, commitContent, githubRequest, DEFAULT_REPO, fetchRuntimeContent, GitHubError } from '@/lib/admin-publish-core';

const env = { ADMIN_PASSWORD: 'secret-pass' };
describe('admin-publish function', () => {
  it('reads runtime JSON from the uncached GitHub API, not the raw CDN', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{"site":{"updatedAt":2000},"blog":{"articles":[]}}'));
    expect(JSON.parse(await fetchRuntimeContent({ GITHUB_TOKEN: 'test' }, fetcher)).site.updatedAt).toBe(2000);
    expect(fetcher.mock.calls[0]?.[0]).toContain('api.github.com/repos/gypsy247/theworkoutplan-final/contents/public/site-content.json?ref=main');
    expect(fetcher.mock.calls[0]?.[1]).toMatchObject({ cache: 'no-store', headers: { Accept: 'application/vnd.github.raw' } });
  });
  it('preserves the exact GitHub failure status and message', async () => {
    const request = githubRequest({ GITHUB_TOKEN: 'test' }, vi.fn().mockResolvedValue(new Response('Token denied', { status: 403 })));
    await expect(request('/git/ref/heads/main')).rejects.toMatchObject({ status: 403, message: 'Token denied' });
  });
  it('retries a SHA conflict once using the latest branch head', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce({ object: { sha: 'old-head' } }).mockResolvedValueOnce({ tree: { sha: 'old-tree' } })
      .mockResolvedValueOnce({ sha: 'tree' }).mockResolvedValueOnce({ sha: 'commit' }).mockRejectedValueOnce(new GitHubError(409, 'Conflict'))
      .mockResolvedValueOnce({ object: { sha: 'latest-head' } }).mockResolvedValueOnce({ tree: { sha: 'latest-tree' } })
      .mockResolvedValueOnce({ sha: 'new-tree' }).mockResolvedValueOnce({ sha: 'saved' }).mockResolvedValueOnce({});
    const files = [{ path: 'src/data/siteContent.json', content: '{"updatedAt":2000}' }, { path: 'src/data/articles.json', content: '{"articles":[]}' }];
    expect(await commitContent(request, files, [], 'release-1')).toBe('saved');
    expect(request.mock.calls[6]?.[0]).toBe('/git/commits/latest-head');
    expect(request.mock.calls[8]?.[2].parents).toEqual(['latest-head']);
  });
  it('does not report success after the retry also fails', async () => {
    const request = vi.fn().mockRejectedValue(new GitHubError(409, 'Still conflicting'));
    await expect(commitContent(request, [], [], 'release-1')).rejects.toMatchObject({ status: 409 });
    expect(request).toHaveBeenCalledTimes(2);
  });
  it('accepts only the default admin email with the server password', () => {
    expect(checkCredentials(env, 'Izzy@TheWorkoutPlant.com', 'secret-pass')).toBe(true);
    expect(checkCredentials(env, 'izzy@theworkoutplant.com', 'wrong')).toBe(false);
    expect(checkCredentials(env, 'other@example.com', 'secret-pass')).toBe(false);
  });
  it('refuses login when no password is configured', () => {
    expect(() => checkCredentials({}, 'izzy@theworkoutplant.com', '')).toThrow();
  });
  it('rejects tampered and expired sessions', async () => {
    const token = await createSession(env, 0);
    expect(await verifySession(env, token, 1000)).toBe(true);
    expect(await verifySession(env, token, 13 * 3600_000)).toBe(false);
    expect(await verifySession({ ADMIN_PASSWORD: 'other' }, token, 1000)).toBe(false);
  });
  it('only allows the two content files and image uploads', () => {
    expect(() => validatePublishInput([{ path: 'netlify.toml', content: '{}' }], [])).toThrow();
    expect(() => validatePublishInput([{ path: 'src/data/siteContent.json', content: '{}' }], [{ path: '../x.jpg', content: '' }])).toThrow();
    expect(validatePublishInput([{ path: 'src/data/articles.json', content: '{}' }], []).files).toHaveLength(1);
  });
  it('builds the runtime site-content.json from both content files', () => {
    const runtime = JSON.parse(buildRuntimeContent([
      { path: 'src/data/siteContent.json', content: '{"hero":{"badgeText":"Hi"}}' },
      { path: 'src/data/articles.json', content: '{"articles":[]}' },
    ]));
    expect(runtime.site.hero.badgeText).toBe('Hi');
    expect(runtime.blog.articles).toEqual([]);
    expect(() => buildRuntimeContent([{ path: 'src/data/siteContent.json', content: '{}' }])).toThrow('Both content files');
  });
  it('commits the runtime JSON with a [skip ci] message so Netlify never rebuilds', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce({ object: { sha: 'head' } })
      .mockResolvedValueOnce({ tree: { sha: 'old-tree' } })
      .mockResolvedValueOnce({ sha: 'new-tree' })
      .mockResolvedValueOnce({ sha: 'new-commit' })
      .mockResolvedValueOnce({});
    await commitContent(request, [
      { path: 'src/data/siteContent.json', content: '{"a":1}' },
      { path: 'src/data/articles.json', content: '{"articles":[]}' },
    ], [], 'release-1');
    const treeBody = request.mock.calls[2]?.[2];
    expect(treeBody.tree.map((entry: { path: string }) => entry.path)).toEqual([
      'src/data/siteContent.json', 'src/data/articles.json', 'public/site-content.json', 'public/studio-version.json',
    ]);
    expect(JSON.parse(treeBody.tree[2].content)).toEqual({ site: { a: 1 }, blog: { articles: [] } });
    expect(request.mock.calls[3]?.[2].message).toContain('[skip ci]');
    expect(request.mock.calls[4]?.[2]).toEqual({ sha: 'new-commit', force: false });
  });
  it('falls back to the default repository when the configured one is gone', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404, text: async () => 'Not Found' })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ object: { sha: 'head' } }) });
    const request = githubRequest({ GITHUB_TOKEN: 'token', GITHUB_REPO: 'old-owner/moved-repo' }, fetcher as unknown as typeof fetch);
    expect(await request('/git/ref/heads/main')).toEqual({ object: { sha: 'head' } });
    expect(fetcher.mock.calls[0]?.[0]).toBe('https://api.github.com/repos/old-owner/moved-repo/git/ref/heads/main');
    expect(fetcher.mock.calls[1]?.[0]).toBe(`https://api.github.com/repos/${DEFAULT_REPO}/git/ref/heads/main`);
  });
  it('reports a clear error when the token is missing', () => {
    expect(() => githubRequest({})).toThrow('GITHUB_TOKEN');
  });
});
