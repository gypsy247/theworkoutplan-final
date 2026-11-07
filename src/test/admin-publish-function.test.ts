import { describe, it, expect, vi } from 'vitest';
import { checkCredentials, createSession, verifySession, validatePublishInput, buildRuntimeContent, commitContent, githubRequest, DEFAULT_REPO } from '@/lib/admin-publish-core';

const env = { ADMIN_PASSWORD: 'secret-pass' };
describe('admin-publish function', () => {
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
