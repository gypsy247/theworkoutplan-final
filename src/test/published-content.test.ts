import { afterEach, describe, expect, it } from 'vitest';
import { createEditorDraft } from '@/lib/admin-content';
import { cachePublishedContent, contentTimestamp, newerContent, readPublishedContent, stampContent } from '@/lib/published-content';

afterEach(() => localStorage.clear());
describe('published photo persistence', () => {
  it('timestamps edits and publishes with a numeric updatedAt', () => {
    const draft = createEditorDraft();
    const base = contentTimestamp(draft);
    expect(stampContent(draft, base + 5000).site.updatedAt).toBe(base + 5000);
    expect(stampContent(draft, 1000).site.updatedAt).toBe(base + 1);
    expect(stampContent(stampContent(draft, 1000), 1000).site.updatedAt).toBe(base + 2);
  });
  it('keeps a newer published facility photo after a stale server refresh', () => {
    const server = stampContent(createEditorDraft(), 1000);
    const published = stampContent(server, 2000);
    published.site.facilityImage = 'data:image/jpeg;base64,new-photo';
    expect(cachePublishedContent(published)).toBe(true);
    expect(newerContent(server, readPublishedContent()).site.facilityImage).toBe('data:image/jpeg;base64,new-photo');
  });
  it('allows newer server saves to replace the browser backup', () => {
    const local = stampContent(createEditorDraft(), 1000);
    const server = stampContent(local, 2000);
    server.site.facilityImage = '/images/newer.jpg';
    expect(newerContent(server, local).site.facilityImage).toBe('/images/newer.jpg');
  });
});