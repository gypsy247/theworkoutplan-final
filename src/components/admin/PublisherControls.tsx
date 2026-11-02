import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle, CloudUpload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { getPublisher, publishStudio, checkStudioDeployment } from '@/lib/studio-publish.functions';
import { validateDraft, type EditorDraft } from '@/lib/admin-content';
import { useStudioSession } from './StudioSession';

export function PublisherControls({ draft, onPublished }: { draft: EditorDraft; onPublished: () => void }) {
  const session = useStudioSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [commit, setCommit] = useState<{ sha: string; url: string } | null>(null);
  const [message, setMessage] = useState('');
  const getAccess = useServerFn(getPublisher);
  const publish = useServerFn(publishStudio);
  const checkDeployment = useServerFn(checkStudioDeployment);
  const access = useQuery({ queryKey: ['studio-publisher', session?.user.id], queryFn: () => getAccess(), enabled: Boolean(session), retry: false, staleTime: Infinity });
  async function run(action: () => Promise<void>) {
    setBusy(true);
    try { await action(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to complete this action.'); } finally { setBusy(false); }
  }
  return <><Button disabled={busy} className="h-10 font-bold" onClick={() => setOpen(true)}>{busy ? <LoaderCircle className="animate-spin" /> : <CloudUpload />}Save & Publish</Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="studio-manager"><DialogHeader><DialogTitle>Publish studio content</DialogTitle><DialogDescription>Owner-only publishing to GitHub. Netlify goes live after a successful deployment.</DialogDescription></DialogHeader>{!session ? <div className="space-y-4"><label className="grid gap-2 text-sm">Owner email<Input aria-label="Owner email" type="email" value={email} onChange={e => setEmail(e.target.value)} /></label><label className="grid gap-2 text-sm">Password<Input aria-label="Owner password" type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><Button disabled={busy} className="w-full" onClick={() => run(async () => { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; setPassword(''); })}>Sign in</Button><Button variant="link" onClick={() => run(async () => { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (error) throw error; toast.success('Check your email for a password reset link.'); })}>Forgot password?</Button>{(['google', 'lovable'] as const).map(provider => <Button key={provider} variant="outline" disabled={busy} className="w-full" onClick={() => run(async () => { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/admin` }); if (result.error) throw new Error(result.error.message); })}>Sign in with {provider === 'google' ? 'Google' : 'Lovable'}</Button>)}<p className="text-xs text-muted-foreground">Use an existing owner account. Publishing access must be assigned separately; signing in never grants it.</p></div> : <div className="space-y-4"><p className="break-all text-sm">Signed in as {session.user.email}</p>{access.isPending ? <p className="flex gap-2 text-sm"><LoaderCircle className="h-4 w-4 animate-spin" />Checking owner access…</p> : access.error ? <p role="alert" className="text-sm text-destructive">{access.error.message}</p> : !access.data?.allowed ? <p role="alert" className="text-sm text-muted-foreground">This account has not been approved to publish. Send the owner email in the project chat to assign access.</p> : <><Button disabled={busy} className="w-full" onClick={() => run(async () => { const error = validateDraft(draft); if (error) throw new Error(error); const result = await publish({ data: { draft, expectedHead: access.data?.head ?? '' } }); setCommit(result); setMessage('Saved to GitHub. Deployment is not yet confirmed.'); toast.success('Saved to GitHub. Waiting for Netlify deployment.'); onPublished(); await access.refetch(); })}>{busy && <LoaderCircle className="animate-spin" />}Publish changes to GitHub</Button>{commit && <><a href={commit.url} target="_blank" rel="noreferrer" className="text-sm text-primary">View saved commit</a><p role="status" className="text-sm">{message}</p><Button variant="outline" disabled={busy} onClick={() => run(async () => { const status = await checkDeployment({ data: { sha: commit.sha } }); if (status.state === 'live') { setMessage('Changes published live successfully!'); toast.success('Changes published live successfully!'); } else setMessage(status.state === 'failed' ? 'Netlify deployment failed. Your files are saved in GitHub.' : status.state === 'unknown' ? 'GitHub has no Netlify deployment confirmation for this commit yet.' : 'Netlify is still building your changes.'); })}>Check Netlify deployment</Button></>}</>}<Button variant="outline" disabled={busy} onClick={() => run(async () => { await supabase.auth.signOut(); setCommit(null); })}>Sign out</Button></div>}</DialogContent></Dialog></>;
}
