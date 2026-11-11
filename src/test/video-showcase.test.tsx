import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoShowcase } from "@/components/site/VideoShowcase";
import { applyLiveContent } from "@/lib/live-content";
import siteContent from "@/data/siteContent.json";
import articlesContent from "@/data/articles.json";

function withVideo(trainingVideoUrl: string) {
  applyLiveContent({ site: { ...siteContent, trainingVideoUrl }, blog: articlesContent } as never);
}

describe("Watch How We Train section", () => {
  it("shows the real YouTube player as soon as the page loads", () => {
    withVideo("youtube.com/watch?v=dQw4w9WgXcQ");
    const { container } = render(<VideoShowcase />);
    expect(container.querySelector("iframe")?.getAttribute("src")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0");
  });

  it("never covers the player with a placeholder or an extra link", () => {
    withVideo("https://youtu.be/dQw4w9WgXcQ");
    const { container } = render(<VideoShowcase />);
    expect(container.querySelector("button")).toBeNull();
    expect(screen.queryByText(/play video/i)).toBeNull();
    expect(screen.queryByText(/open video/i)).toBeNull();
  });

  it("keeps the placeholder only while no video is configured", () => {
    withVideo("");
    const { container } = render(<VideoShowcase />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });
});
