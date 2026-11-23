import { ConsultationForm } from "./ConsultationForm";

export function ConsultationSection() {
  return <section id="contact" className="border-t border-border px-6 py-16">
    <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-2 md:gap-16">
      <div>
        <p className="text-sm text-primary">A conversation, not a commitment</p>
        <h2 className="mt-3">Let’s find the right plan for you.</h2>
        <p className="mt-4 text-muted-foreground">Tell us a little about yourself. Coach Izzy will get in touch to answer your questions and talk through your next steps.</p>
        <p className="mt-6 text-sm text-muted-foreground">139 Frost St, Williamsburg, Brooklyn</p>
      </div>
      <div id="consultation" className="consultation-panel card-surface p-5 md:p-6">
        <h2 className="mb-4">Request a free consultation</h2>
        <ConsultationForm />
      </div>
    </div>
  </section>;
}