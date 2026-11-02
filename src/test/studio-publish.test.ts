import { describe, it, expect, vi } from 'vitest';
import { publishRepository, encodeUtf8, isReleaseLive, repositoryRequest } from '@/lib/netlify-publish';
import { createEditorDraft } from '@/lib/admin-content';
describe('GitHub publishing', () => {
  it('commits both exact JSON files atomically without forcing the branch', async () => {
    const request = vi.fn().mockResolvedValueOnce({ object: { sha: 'parent' } }).mockResolvedValueOnce({ tree: { sha: 'old-tree' } }).mockResolvedValueOnce({ sha: 'new-tree' }).mockResolvedValueOnce({ sha: 'new-commit' }).mockResolvedValueOnce({});
    const draft = createEditorDraft();
    await publishRepository(request, draft, 'parent', [], 'release-1');
    const body = request.mock.calls[2]?.[2];
    expect(body.tree.map((file: { path: string }) => file.path)).toEqual(['src/data/siteContent.json', 'src/data/articles.json', 'public/studio-version.json']);
    expect(JSON.parse(body.tree[0].content)).toEqual(draft.site);
    expect(JSON.parse(body.tree[1].content)).toEqual(draft.blog);
    expect(request.mock.calls[4]?.[2]).toEqual({ sha: 'new-commit', force: false });
  });
  it('refuses writes when the branch changed', async () => {
    const request = vi.fn().mockResolvedValue({ object: { sha: 'different' } });
    await expect(publishRepository(request, createEditorDraft(), 'parent', [], 'release-1')).rejects.toThrow('repository changed');
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('does not report live until the published site serves the exact release', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ releaseId: 'old' }) }).mockResolvedValueOnce({ ok: true, json: async () => ({ releaseId: 'release-1' }) }));
    expect(await isReleaseLive('release-1')).toBe(false);
    expect(await isReleaseLive('release-1')).toBe(true);
    vi.unstubAllGlobals();
  });
  it('encodes Unicode JSON without corrupting quotes and accents', () => {
    const text = '“Strength” — café 🌱';
    expect(new TextDecoder().decode(Uint8Array.from(atob(encodeUtf8(text)), character => character.charCodeAt(0)))).toBe(text);
  });
  it('includes uploaded images in the same main-branch commit', async () => {
    const request = vi.fn().mockResolvedValueOnce({ object: { sha: 'parent' } }).mockResolvedValueOnce({ tree: { sha: 'old-tree' } }).mockResolvedValueOnce({ sha: 'photo-blob' }).mockResolvedValueOnce({ sha: 'new-tree' }).mockResolvedValueOnce({ sha: 'new-commit' }).mockResolvedValueOnce({});
    await publishRepository(request, createEditorDraft(), 'parent', [{ path: 'public/images/new-photo.jpg', content: 'aGVsbG8=' }], 'release-1');
    expect(request.mock.calls[2]).toEqual(['/git/blobs', 'POST', { content: 'aGVsbG8=', encoding: 'base64' }]);
    expect(request.mock.calls[3]?.[2].tree).toContainEqual({ path: 'public/images/new-photo.jpg', mode: '100644', type: 'blob', sha: 'photo-blob' });
    expect(request.mock.calls[5]).toEqual(['/git/refs/heads/main', 'PATCH', { sha: 'new-commit', force: false }]);
  });
  it('sends Netlify credentials only to the same-origin Git Gateway', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ object: { sha: 'parent' } }) });
    vi.stubGlobal('fetch', fetcher);
    await repositoryRequest({ kind: 'netlify', token: async () => 'test-token' })('/git/ref/heads/main');
    expect(fetcher.mock.calls[0]?.[0]).toBe('/.netlify/git/github/git/ref/heads/main');
    expect(fetcher.mock.calls[0]?.[1].headers.Authorization).toBe('Bearer test-token');
    vi.unstubAllGlobals();
  });
});