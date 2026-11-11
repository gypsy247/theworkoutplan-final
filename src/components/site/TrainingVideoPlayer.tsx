import { useEffect, useState } from "react";
import { getVideoEmbedInfo, normalizeVideoUrl } from "@/lib/homepage-media";

export function TrainingVideoPlayer({ url, title, autoPlay = false }: { url: string; title: string; autoPlay?: boolean }) {
  const normalized = normalizeVideoUrl(url);
  const info = getVideoEmbedInfo(normalized);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [normalized]);
  if (info.kind === "empty") return null;
  return <div className="w-full">
    {info.kind === "embed" && <iframe key={info.src} src={info.src} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-2xl border-0" />}
    {info.kind === "file" && <video key={info.src} src={info.src} title={title} aria-label={title} className="aspect-video w-full rounded-2xl" controls autoPlay={autoPlay} playsInline preload="metadata" onError={() => setFailed(true)} />}
    {failed && <p role="alert" className="px-4 pt-3 text-sm text-muted-foreground">This video could not play.</p>}
    {info.openUrl && <p className="px-4 py-3 text-sm"><a className="text-primary underline" href={info.openUrl} target="_blank" rel="noopener noreferrer">Open video</a></p>}
  </div>;
}