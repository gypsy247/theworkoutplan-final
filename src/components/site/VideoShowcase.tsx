import { useState } from "react";
import { Play } from "lucide-react";
import siteContent from "@/data/siteContent.json";

const videoUrl = siteContent.trainingVideoUrl;

function isEmbed(url: string) {
  return /youtube|youtu\.be|vimeo/.test(url);
}

export function VideoShowcase() {
  const [playing, setPlaying] = useState(false);
  return (
    <section id="watch" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Watch How We Train</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Real Coaching. Real Work. Real Results.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Step inside a 1-on-1 session at 139 Frost St.</p>
        </div>
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-primary/30 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.45)]">
          <div className="relative aspect-video w-full bg-secondary">
            {videoUrl && playing ? (
              isEmbed(videoUrl) ? (
                <iframe src={videoUrl} title="Watch How We Train — The Workout Plant" className="absolute inset-0 h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <video src={videoUrl} title="Watch How We Train — The Workout Plant" className="absolute inset-0 h-full w-full" controls autoPlay />
              )
            ) : (
              <button
                type="button"
                onClick={() => videoUrl && setPlaying(true)}
                aria-label="Play training video"
                className="group absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_65%)]"
              >
                <span className="flex flex-col items-center gap-4">
                  <span className="grid h-20 w-20 place-items-center rounded-full border border-primary/50 bg-background/80 text-primary shadow-[0_0_40px_-8px_hsl(var(--primary)/0.7)] transition group-hover:scale-105">
                    <Play className="h-8 w-8 fill-current" />
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {videoUrl ? "Play video" : "Training video coming soon"}
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
