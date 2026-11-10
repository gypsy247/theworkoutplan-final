/** Safe to share between the browser and the alias-free Netlify function. */
export function publishErrorMessage(value: unknown, status?: number, fallback = 'Publishing failed. Please try again.'): string {
  if (status === 404) return 'The publishing repository could not be found. Check GITHUB_REPO and give the server’s GitHub token access to the repository.';
  if (status === 401) return 'Your session or GitHub connection expired. Sign in again; if this continues, check the server’s GitHub token.';
  if (status === 403) return 'GitHub refused access. Give the server’s GitHub token permission to read and update the repository.';
  if (typeof value !== 'string') return fallback;
  const message = value.trim();
  if (!message) return fallback;
  if (message.startsWith('{') || message.startsWith('[')) {
    try {
      const data = JSON.parse(message);
      const code = Number(data?.status);
      if ([401, 403, 404].includes(code)) return publishErrorMessage(null, code, fallback);
    } catch { /* Never show a raw response body. */ }
    return fallback;
  }
  if (/^not found$/i.test(message)) return publishErrorMessage(null, 404, fallback);
  if (/^<!|^<html/i.test(message)) return fallback;
  return message;
}