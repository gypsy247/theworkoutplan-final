import { createContext, useContext, useState, type ReactNode } from 'react';

export const ADMIN_ENDPOINT = '/.netlify/functions/admin-publish';
type StudioAuth = { token: string | null; email: string | null; login: (email: string, password: string) => Promise<void>; logout: () => void };
const SessionContext = createContext<StudioAuth | null>(null);

export function useStudioSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('StudioSession is required.');
  return value;
}

export async function readError(response: Response, fallback: string) {
  try { const data = await response.json(); return data.error || fallback; } catch { return `${fallback} (${response.status})`; }
}

// The session token lives only in memory; the server verifies credentials and signs it.
export function StudioSession({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const login = async (address: string, password: string) => {
    const response = await fetch(ADMIN_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', email: address, password }) });
    if (!response.ok) throw new Error(await readError(response, 'Unable to sign in.'));
    const data = await response.json();
    setToken(data.token); setEmail(address.trim());
  };
  return <SessionContext.Provider value={{ token, email, login, logout: () => { setToken(null); setEmail(null); } }}>{children}</SessionContext.Provider>;
}
