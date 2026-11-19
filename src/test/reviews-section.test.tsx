import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewsSection } from "@/components/site/ReviewsSection";

describe("Google Reviews section", () => {
  it("flows from the heading straight into the rating breakdown card", () => {
    const { container } = render(<ReviewsSection />);

    // The compact Google Business card with its Directions / Read Reviews buttons is gone.
    expect(screen.queryByText(/^Directions$/)).toBeNull();
    expect(screen.queryByText(/read reviews/i)).toBeNull();
    expect(container.querySelectorAll("a[href*='google.com/maps']").length).toBeGreaterThan(0);

    // The large rating-breakdown card is still the first thing under the heading.
    expect(screen.getByText("70+ Verified Google Reviews")).toBeInTheDocument();
    expect(screen.getByText("5★")).toBeInTheDocument();
    expect(screen.getByText("96%")).toBeInTheDocument();
  });
});
