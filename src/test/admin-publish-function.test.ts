import { describe, it, expect } from 'vitest';
import { checkCredentials, createSession, verifySession, validatePublishInput } from '@/lib/admin-publish-core';

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
});
