import { useEffect, useState } from 'react';
import { LoaderCircle, CloudUpload, KeyRound, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getRepositoryHead, isReleaseLive, publishRepository, repositoryRequest, type PendingImage } from '@/lib/netlify-publish';
import type { EditorDraft } from '@/lib/admin-content';
import { useStudioSession } from './StudioSession';

export function NetlifyLogin() {
  const session = useStudioSession();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  return <div className="grid gap-2"><Button disabled={!session.ready} onClick={session.login}><LogIn />Log In with Netlify Identity to Publish Live</Button><Button variant="link" onClick={() => setOpen(true)}><KeyRound />Use a GitHub token instead</Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="studio-manager"><DialogHeader><DialogTitle>GitHub token fallback</DialogTitle><DialogDescription>Use a fine-grained token restricted to this repository with Contents read/write permission. It stays in memory until sign-out or refresh.</DialogDescription></DialogHeader><Input aria-label="GitHub personal access token" type="password" autoComplete="off" value={token} onChange={event => setToken(event.target.value)} /><Button disabled={!token.trim()} onClick={() => { session.useToken(token); setToken(''); setOpen(false); }}>Connect repository</Button></DialogContent></Dialog></div>;
}

export function PublisherControls({ draft, images, onPublished, onBusy }: { draft: EditorDraft; images: PendingImage[]; onPublished: () => void; onBusy: (value: boolean) => void }) {
  const session = useStudioSession();
  const kind = session.access?.kind;
  const email = session.user?.email;
  const [head, setHead] = useState('');
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [commit, setCommit] = useState<{ url: string; releaseId: string } | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    setHead(''); setConnected(false); setError(''); setCommit(null);
    if (session.access) getRepositoryHead(repositoryRequest(session.access)).then(value => { if (active) { setHead(value); setConnected(true); } }).catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [kind, email]);
  useEffect(() => {
    if (!commit) return;
    let active = true;
    let attempts = 0;
    const check = async () => {
      try { if (await isReleaseLive(commit.releaseId)) { if (active) { setMessage('Changes published live successfully!'); toast.success('Changes published live successfully!'); } window.clearInterval(timer); } } catch { /* A deploying site may temporarily be unavailable. */ }
      if (++attempts >= 60) window.clearInterval(timer);
    };
    const timer = window.setInterval(check, 5000);
    void check();
    return () => { active = false; window.clearInterval(timer); };
  }, [commit]);
  if (!session.access) return <NetlifyLogin />;
  return <div className="grid max-w-md gap-2"><div className="flex flex-wrap items-center gap-2"><Button disabled={!head || busy} onClick={async () => {
    const access = session.access;
    if (!access) return;
    setBusy(true); onBusy(true); setError('');
    try {
      const result = await publishRepository(repositoryRequest(access), structuredClone(draft), head, images, crypto.randomUUID());
      setCommit(result); setHead(result.sha); setMessage('Saved to GitHub. Waiting for Netlify deployment.'); onPublished();
      toast.success('Saved to GitHub. Netlify deployment pending.');
    } catch (reason) { const text = reason instanceof Error ? reason.message : 'Publishing failed.'; setError(text); toast.error(text); }
    finally { setBusy(false); onBusy(false); }
  }}>{busy ? <LoaderCircle className="animate-spin" /> : <CloudUpload />}Publish Changes Live</Button><Button variant="ghost" disabled={busy} onClick={() => void session.logout()}>Sign out</Button></div><p className="text-xs text-muted-foreground">{connected ? kind === 'netlify' ? 'Connected to Live Site (Netlify + GitHub)' : 'Connected to GitHub (token)' : 'Connecting to repository…'}</p>{error && <p role="alert" className="break-words text-xs text-destructive">{error}</p>}{commit && <><p role="status" className="text-xs">{message}</p><a className="text-xs text-primary" href={commit.url} target="_blank" rel="noreferrer">View saved commit</a><Button variant="link" onClick={async () => { try { setMessage(await isReleaseLive(commit.releaseId) ? 'Changes published live successfully!' : 'Deployment is not confirmed yet. Check Netlify for build errors or pending deployments.'); } catch { setMessage('Unable to reach the deployed site. Check Netlify deployment status.'); } }}>Check live deployment</Button></>}</div>;
}
