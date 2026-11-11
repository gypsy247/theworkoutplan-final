import { useLiveContent } from "@/lib/live-content";
import { getVideoEmbedInfo, normalizeVideoUrl } from "@/lib/homepage-media";
import { TrainingVideoPlayer } from "./TrainingVideoPlayer";

export function VideoShowcase() {
  const videoUrl = normalizeVideoUrl(useLiveContent().site.trainingVideoUrl);
  const info = getVideoEmbedInfo(videoUrl);
  const playable = info.kind === "embed" || info.kind === "file";
  return (
    <section id="watch" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Watch How We Train</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Real Coaching. Real Work. Real Results.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Step inside a 1-on-1 session at 139 Frost St.</p>
        </div>
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-primary/30 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.45)]">
          <div className="relative w-full bg-secondary">
            {playable ? (
              <TrainingVideoPlayer url={videoUrl} title="Watch How We Train — The Workout Plant" />
            ) : (
              <div className="grid aspect-video w-full place-items-center px-6 text-center">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {info.kind === "empty" ? "Training video coming soon" : "Training video link isn't recognized yet"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
