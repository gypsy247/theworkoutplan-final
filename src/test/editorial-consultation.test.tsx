import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConsultationForm } from "@/components/site/ConsultationForm";
import { submitConsultation } from "@/lib/consultation-submit";
import site from "@/data/siteContent.json";
import { mergeEditorial } from "@/lib/editorial";

vi.mock("@/lib/consultation-submit", () => ({ submitConsultation: vi.fn() }));

beforeEach(() => { vi.mocked(submitConsultation).mockReset(); });

function completeForm() {
  fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Jamie Rivera" } });
  fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "9175550136" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jamie@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Have Coach Izzy Reach Out" }));
}

describe("Low-friction consultation rules", () => {
  it("submits an empty session tier without an upfront selection", async () => {
    vi.mocked(submitConsultation).mockResolvedValue(1);
    render(<ConsultationForm />);
    completeForm();
    await waitFor(() => expect(submitConsultation).toHaveBeenCalledWith(expect.objectContaining({ sessionTier: "" })));
  });
  it("allows submission without optional SMS consent", async () => {
    vi.mocked(submitConsultation).mockResolvedValue(1);
    render(<ConsultationForm />);
    completeForm();
    await waitFor(() => expect(submitConsultation).toHaveBeenCalledWith(expect.objectContaining({ smsConsent: false })));
  });
  it("allows submission without optional goals", async () => {
    vi.mocked(submitConsultation).mockResolvedValue(1);
    render(<ConsultationForm />);
    completeForm();
    await waitFor(() => expect(submitConsultation).toHaveBeenCalledWith(expect.objectContaining({ goals: "", fullName: "Jamie Rivera", phone: "9175550136", email: "jamie@example.com" })));
  });
  it("only calls completion after delivery succeeds", async () => {
    vi.mocked(submitConsultation).mockRejectedValue(new Error("Delivery failed"));
    const onDone = vi.fn();
    render(<ConsultationForm onDone={onDone} />);
    completeForm();
    await waitFor(() => expect(submitConsultation).toHaveBeenCalledTimes(1));
    expect(onDone).not.toHaveBeenCalled();
  });
});

describe("Required public rates", () => {
  it.each([["izzy", 170], ["analine", 115], ["dev", 95], ["virtual", 150]] as const)("prices %s at $%s", (id, price) => {
    expect(site.pricingTiers.find((tier) => tier.id === id)?.price).toBe(price);
  });
  it("offers no small group tier", () => expect(site.pricingTiers.some((tier) => /group/i.test(tier.name))).toBe(false));
});

describe("Editorial copy fallback", () => {
  it("keeps bundled hero copy when published content has none", () => expect(mergeEditorial(undefined).hero.headline).toBe(site.editorial.hero.headline));
  it("uses a published headline over the default", () => expect(mergeEditorial({ hero: { ...site.editorial.hero, headline: "New" } }).hero.headline).toBe("New"));
});