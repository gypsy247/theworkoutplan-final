import { useLiveContent } from "@/lib/live-content";
import { getVideoEmbedInfo, normalizeVideoUrl } from "@/lib/homepage-media";
import { TrainingVideoPlayer } from "./TrainingVideoPlayer";

export function VideoShowcase() {
  const videoUrl = normalizeVideoUrl(useLiveContent().site.trainingVideoUrl);
  const info = getVideoEmbedInfo(videoUrl);
  return (
    <section id="watch" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Watch How We Train</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Inside our private studio.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Step inside a 1-on-1 session at 139 Frost St.</p>
        </div>
        <div className="relative mt-10 overflow-hidden rounded-lg border border-border">
          <div className="relative w-full bg-secondary">
            {info.kind === "embed" ? (
              <iframe src={info.src} title="Watch How We Train — The Workout Plant" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="aspect-video w-full border-0" />
            ) : info.kind === "file" ? (
              <TrainingVideoPlayer url={videoUrl} title="Watch How We Train — The Workout Plant" />
            ) : (
              <img src="/images/studio-action-izzy.jpg" alt="Coach Izzy working with a client at The Workout Plant" loading="lazy" className="aspect-video w-full object-cover" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
