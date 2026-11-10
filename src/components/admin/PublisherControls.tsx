import { useState } from 'react';
import { LoaderCircle, CloudUpload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { serializeExports, validateDraft, type EditorDraft } from '@/lib/admin-content';
import type { PendingImage } from '@/lib/netlify-publish';
import { ADMIN_ENDPOINT, readError, useStudioSession } from './StudioSession';
import { stampContent } from '@/lib/published-content';
import { rememberPublishedContent } from '@/lib/live-content';

export function PublisherControls({ draft, images, onPublished, onBusy }: { draft: EditorDraft; images: PendingImage[]; onPublished: () => void; onBusy: (value: boolean) => void }) {
  const session = useStudioSession();
  const [busy, setBusy] = useState(false);
  const publish = async () => {
    const invalid = validateDraft(draft);
    if (invalid) { toast.error(invalid); return; }
    setBusy(true); onBusy(true);
    try {
      const files = serializeExports(stampContent(draft)).map(file => ({ path: `src/data/${file.filename}`, content: file.content }));
      const response = await fetch(ADMIN_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ action: 'publish', files, images, releaseId: crypto.randomUUID() }) });
      if (response.status === 401) { session.logout(); throw new Error(await readError(response, 'Please sign in again.')); }
      if (!response.ok) throw new Error(await readError(response, 'Publishing failed.'));
      const result = await response.json();
      if (!result.sha) throw new Error('The server did not confirm the save. Please try again.');
      const published: EditorDraft = { site: JSON.parse(files[0]?.content || '{}'), blog: JSON.parse(files[1]?.content || '{}') };
      const cached = rememberPublishedContent(published);
      try { localStorage.setItem('twp-last-published', JSON.stringify({ at: new Date().toISOString(), files: files.map(file => file.path) })); } catch { /* cache is best-effort */ }
      onPublished();
      toast.success('Saved & Published!');
      if (!cached) toast.warning('Saved online, but this browser could not keep a refresh backup.');
    } catch (reason) { toast.error(reason instanceof Error ? reason.message : 'Publishing failed.'); }
    finally { setBusy(false); onBusy(false); }
  };
  return <Button disabled={busy} onClick={publish} className="font-bold">{busy ? <LoaderCircle className="animate-spin" /> : <CloudUpload />}Publish Changes Live</Button>;
}
