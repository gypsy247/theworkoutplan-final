import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { MAPS_URL } from "./brand";

export function ReviewsSection() {
  useEffect(() => {
    const src = "https://elfsightcdn.com/platform.js";
    const selector = `script[src="${src}"]`;
    if (document.body.querySelector(selector) || document.head.querySelector(selector)) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return (
    <section id="reviews" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            What our Williamsburg clients say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">4.9 ★ across 70+ verified Google Reviews.</p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="elfsight-app-ff061720-2ead-471c-87c6-48fa40ed2897" data-elfsight-app-lazy />
        </div>
        <div className="mt-8 text-center"><a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4">Read the reviews on Google <ExternalLink className="h-4 w-4" /></a></div>
      </div>
    </section>
  );
}
