import { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EditorDraft } from "@/lib/admin-content";
import { DRAFT_MESSAGE, PREVIEW_READY, previewViewports } from "@/lib/draft-preview";

export function DraftPreview({ draft, imagePreviews = {}, onClose }: { draft: EditorDraft; imagePreviews?: Record<string, string>; onClose: () => void }) {
  const [viewport, setViewport] = useState<(typeof previewViewports)[number]>(previewViewports[0]);
  const frame = useRef<HTMLIFrameElement>(null);
  const latest = useRef(draft);
  latest.current = draft;
  const images = useRef(imagePreviews);
  images.current = imagePreviews;
  function sendDraft() {
    const content = structuredClone(latest.current);
    content.site.trainers.forEach(t => { t.image = images.current[t.image] ?? t.image; });
    [...content.site.studioPhotos, ...content.site.appScreenshots].forEach(p => { p.image = images.current[p.image] ?? p.image; });
    content.site.studioInfo.logoImage = images.current[content.site.studioInfo.logoImage] ?? content.site.studioInfo.logoImage;
    frame.current?.contentWindow?.postMessage({ type: DRAFT_MESSAGE, content }, window.location.origin);
  }
  useEffect(() => { sendDraft(); }, [draft, imagePreviews]);
  useEffect(() => {
    const ready = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === PREVIEW_READY) sendDraft();
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("message", ready);
    window.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = overflow; window.removeEventListener("message", ready); window.removeEventListener("keydown", escape); };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Live Preview" className="fixed inset-0 z-[70] flex flex-col bg-background">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0"><p className="text-sm font-bold">Live Preview</p><p className="text-xs text-muted-foreground">Unsaved draft</p></div>
        <div className="flex shrink-0 items-center gap-1">
          {previewViewports.map(option => <Button key={option.id} title={`${option.label} (${option.width}px)`} aria-label={`${option.label} (${option.width}px)`} variant={viewport.id === option.id ? "secondary" : "ghost"} size="sm" onClick={() => setViewport(option)} aria-pressed={viewport.id === option.id}>{option.id === "desktop" ? <Monitor /> : <Smartphone />}<span className="hidden sm:inline">{option.label} ({option.width}px)</span></Button>)}
          <Button variant="ghost" size="icon" aria-label="Close preview" onClick={onClose}><X /></Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-x-auto bg-secondary p-2 sm:p-4">
        <iframe ref={frame} title="Studio draft website" src="/?preview=1" width={viewport.width} onLoad={sendDraft} className="mx-auto block h-full max-w-none shrink-0 border-0 bg-background ring-1 ring-border" style={{ width: viewport.width, minWidth: viewport.width }} />
      </div>
    </div>
  );
}
