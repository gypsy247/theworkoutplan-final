import { describe, it, expect, vi } from 'vitest';
import { commitContent, deploymentState } from '@/lib/studio-publish.server';
import { createEditorDraft } from '@/lib/admin-content';
describe('GitHub publishing', () => {
  it('commits both exact JSON files atomically without forcing the branch', async () => {
    const request = vi.fn().mockResolvedValueOnce({ object: { sha: 'parent' } }).mockResolvedValueOnce({ tree: { sha: 'old-tree' } }).mockResolvedValueOnce({ sha: 'new-tree' }).mockResolvedValueOnce({ sha: 'new-commit' }).mockResolvedValueOnce({});
    const draft = createEditorDraft();
    await commitContent(request, draft, 'parent');
    const body = request.mock.calls[2]?.[2];
    expect(body.tree.map((file: { path: string }) => file.path)).toEqual(['src/data/siteContent.json', 'src/data/articles.json']);
    expect(JSON.parse(body.tree[0].content)).toEqual(draft.site);
    expect(JSON.parse(body.tree[1].content)).toEqual(draft.blog);
    expect(request.mock.calls[4]?.[2]).toEqual({ sha: 'new-commit', force: false });
  });
  it('refuses writes when the branch changed', async () => {
    const request = vi.fn().mockResolvedValue({ object: { sha: 'different' } });
    await expect(commitContent(request, createEditorDraft(), 'parent')).rejects.toThrow('repository changed');
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('does not report live without a successful Netlify status', () => {
    expect(deploymentState([]).state).toBe('unknown');
    expect(deploymentState([{ context: 'Netlify', state: 'pending' }]).state).toBe('pending');
    expect(deploymentState([{ context: 'Netlify', state: 'failure' }]).state).toBe('failed');
    expect(deploymentState([{ context: 'Netlify', state: 'success' }]).state).toBe('live');
    expect(deploymentState([{ context: 'unrelated', state: 'success' }]).state).toBe('unknown');
  });
});