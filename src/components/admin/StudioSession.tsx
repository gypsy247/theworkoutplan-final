import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
const SessionContext = createContext<Session | null>(null);
export const useStudioSession = () => useContext(SessionContext);
export function StudioSession({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) setSession(data.session); });
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') void queryClient.invalidateQueries({ queryKey: ['studio-publisher'] });
      if (event === 'SIGNED_OUT') { void queryClient.cancelQueries({ queryKey: ['studio-publisher'] }); queryClient.removeQueries({ queryKey: ['studio-publisher'] }); }
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [queryClient]);
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
