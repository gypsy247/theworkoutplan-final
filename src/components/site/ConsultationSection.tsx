import { ConsultationForm } from "./ConsultationForm";
import { useEditorial } from "@/lib/editorial";
import { useLiveContent } from "@/lib/live-content";

export function ConsultationSection() {
  const copy = useEditorial().consultation;
  const address = useLiveContent().site.studioInfo.address;
  return <section id="contact" className="border-t border-border px-6 py-16">
    <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-2 md:gap-16">
      <div>
        <p className="text-sm text-primary">{copy.sectionEyebrow}</p>
        <h2 className="mt-3">{copy.sectionHeading}</h2>
        <p className="mt-4 text-muted-foreground">{copy.sectionIntro}</p>
        <p className="mt-6 text-sm text-muted-foreground">{address}</p>
      </div>
      <div id="consultation" className="consultation-panel card-surface p-5 md:p-6">
        <h2 className="mb-4">{copy.panelTitle}</h2>
        <ConsultationForm />
      </div>
    </div>
  </section>;
}