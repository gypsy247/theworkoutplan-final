import { describe, expect, it, vi } from 'vitest';
import { compressImage } from '@/lib/image-tools';

describe('local photo selection', () => {
  it('compresses into a self-contained JPEG without requesting any upload', async () => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 2000, height: 1000, close: vi.fn() }));
    const context = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
    const jpeg = 'data:image/jpeg;base64,cGhvdG8=';
    const encode = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(jpeg);
    try {
      expect(await compressImage(new File(['photo'], 'photo.png', { type: 'image/png' }))).toBe(jpeg);
      expect(encode).toHaveBeenCalledWith('image/jpeg', 0.75);
      expect(fetcher).not.toHaveBeenCalled();
    } finally {
      context.mockRestore(); encode.mockRestore(); vi.unstubAllGlobals();
    }
  });
});