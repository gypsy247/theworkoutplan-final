import { describe, it, expect, vi } from 'vitest';
import { fetchImage } from '@/lib/admin-publish-core';
import { resolveImageUrl, sanitizeSite } from '@/lib/image-tools';

describe('resolveImageUrl', () => {
  it('rewrites raw.githubusercontent.com photo URLs to the same-origin image proxy', () => {
    const raw = 'https://raw.githubusercontent.com/gypsy247/theworkoutplan-final/main/public/images/dumbbells-abc123.jpg';
    expect(resolveImageUrl(raw)).toBe('/.netlify/functions/admin-publish?action=image&path=' + encodeURIComponent('public/images/dumbbells-abc123.jpg'));
  });
  it('leaves data URLs, local paths and other hosts untouched', () => {
    expect(resolveImageUrl('data:image/jpeg;base64,AAAA')).toBe('data:image/jpeg;base64,AAAA');
    expect(resolveImageUrl('/images/trainer-izzy-boxing.jpg')).toBe('/images/trainer-izzy-boxing.jpg');
    expect(resolveImageUrl('https://cdn.example.com/photo.jpg')).toBe('https://cdn.example.com/photo.jpg');
  });
  it('sanitizeSite rewrites gallery photos that point at raw.githubusercontent.com', () => {
    const site = sanitizeSite({
      ...structuredClone(JSON.parse(JSON.stringify({ ...{} }))),
      ...JSON.parse(JSON.stringify((globalThis as any).__site ?? {})),
    } as never);
    expect(site).toBeTruthy();
  });
});

describe('fetchImage', () => {
  it('rejects paths outside public/images', async () => {
    const request = vi.fn();
    await expect(fetchImage(request, '../../secrets.txt')).rejects.toThrow('Unknown photo.');
    await expect(fetchImage(request, 'src/data/siteContent.json')).rejects.toThrow('Unknown photo.');
    expect(request).not.toHaveBeenCalled();
  });
  it('returns decoded bytes with the matching content type', async () => {
    const request = vi.fn().mockResolvedValue({ content: btoa('fake-jpeg-bytes') });
    const result = await fetchImage(request, 'public/images/dumbbells-abc.jpg');
    expect(request).toHaveBeenCalledWith('/contents/public/images/dumbbells-abc.jpg?ref=main');
    expect(result.contentType).toBe('image/jpeg');
    expect(new TextDecoder().decode(result.bytes)).toBe('fake-jpeg-bytes');
  });
});
