import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initializeIdentity, type IdentityUser } from '@/lib/netlify-identity';
import type { RepositoryAccess } from '@/lib/netlify-publish';
type StudioAuth = { user: IdentityUser | null; access: RepositoryAccess | null; ready: boolean; login: () => void; logout: () => Promise<void>; useToken: (token: string) => void };
const SessionContext = createContext<StudioAuth | null>(null);
export function useStudioSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('StudioSession is required.');
  return value;
}
export function StudioSession({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IdentityUser | null>(null);
  const [personalToken, setPersonalToken] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let detach = () => {};
    const attach = () => {
      const widget = window.netlifyIdentity;
      if (!widget) return false;
      const sync = () => { setUser(widget.currentUser()); setReady(true); };
      const login = () => { sync(); setPersonalToken(''); widget.close(); };
      widget.on('init', sync); widget.on('login', login); widget.on('logout', sync);
      initializeIdentity(widget); sync();
      detach = () => { widget.off('init', sync); widget.off('login', login); widget.off('logout', sync); };
      return true;
    };
    const timer = attach() ? undefined : window.setInterval(() => { if (attach()) window.clearInterval(timer); }, 250);
    return () => { window.clearInterval(timer); detach(); };
  }, []);
  const access: RepositoryAccess | null = personalToken ? { kind: 'github', token: async () => personalToken } : user ? { kind: 'netlify', token: () => user.jwt() } : null;
  return <SessionContext.Provider value={{ user, access, ready, login: () => window.netlifyIdentity?.open('login'), logout: async () => { setPersonalToken(''); setUser(null); if (window.netlifyIdentity?.currentUser()) await window.netlifyIdentity.logout(); }, useToken: token => setPersonalToken(token.trim()) }}>{children}</SessionContext.Provider>;
}
