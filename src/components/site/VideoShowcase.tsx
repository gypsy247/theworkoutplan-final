import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useLiveContent } from "@/lib/live-content";
import { normalizeVideoUrl } from "@/lib/homepage-media";
import { TrainingVideoPlayer } from "./TrainingVideoPlayer";
import { Button } from "@/components/ui/button";

export function VideoShowcase() {
  const videoUrl = normalizeVideoUrl(useLiveContent().site.trainingVideoUrl);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { setPlaying(false); }, [videoUrl]);
  return (
    <section id="watch" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Watch How We Train</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Real Coaching. Real Work. Real Results.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Step inside a 1-on-1 session at 139 Frost St.</p>
        </div>
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-primary/30 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.45)]">
          <div className={`relative w-full bg-secondary ${playing ? "" : "aspect-video"}`}>
            {videoUrl && playing ? (
              <TrainingVideoPlayer url={videoUrl} title="Watch How We Train — The Workout Plant" autoPlay />
            ) : (
              <Button
                variant="ghost"
                type="button"
                onClick={() => videoUrl && setPlaying(true)}
                aria-label="Play training video"
                disabled={!videoUrl}
                className="group absolute inset-0 grid h-full w-full place-items-center bg-secondary"
              >
                <span className="flex flex-col items-center gap-4">
                  <span className="grid h-20 w-20 place-items-center rounded-full border border-primary/50 bg-background/80 text-primary shadow-[0_0_40px_-8px_hsl(var(--primary)/0.7)] transition group-hover:scale-105">
                    <Play className="h-8 w-8 fill-current" />
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {videoUrl ? "Play video" : "Training video coming soon"}
                  </span>
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
