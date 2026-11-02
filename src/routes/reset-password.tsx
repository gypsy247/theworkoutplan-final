import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pageHead } from '@/lib/site-seo';
export const Route = createFileRoute('/reset-password')({ head: () => pageHead('/reset-password', 'Reset Owner Password | The Workout Plant', 'Reset your Studio Manager account password.'), component: ResetPassword });
function ResetPassword() {
  const [password, setPassword] = useState(''); const [recovery, setRecovery] = useState(false); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  useEffect(() => { setRecovery(new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'); const { data } = supabase.auth.onAuthStateChange(event => { if (event === 'PASSWORD_RECOVERY') setRecovery(true); }); return () => data.subscription.unsubscribe(); }, []);
  return <section className="mx-auto max-w-md px-6 py-20"><h1 className="text-3xl font-bold">Reset your password</h1>{recovery ? <form className="mt-6 grid gap-4" onSubmit={async event => { event.preventDefault(); setBusy(true); const { error } = await supabase.auth.updateUser({ password }); setMessage(error?.message ?? 'Password updated. Return to Studio Manager.'); setBusy(false); }}><label className="grid gap-2">New password<Input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></label><Button disabled={busy}>Update password</Button></form> : <p className="mt-6 text-muted-foreground">Open this page from your password reset email.</p>}<p role="status" className="mt-4 text-sm">{message}</p><Button asChild variant="link"><Link to="/admin">Return to Studio Manager</Link></Button></section>;
}
