import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ReviewsSection } from "@/components/site/ReviewsSection";

const src = "https://elfsightcdn.com/platform.js";
const selector = `script[src="${src}"]`;

afterEach(() => {
  cleanup();
  document.querySelectorAll(selector).forEach((script) => script.remove());
});

describe("Elfsight client script lifecycle", () => {
  it("loads the platform asynchronously once across navigation remounts", () => {
    const first = render(<ReviewsSection />);
    const script = document.body.querySelector<HTMLScriptElement>(selector);
    expect(script?.src).toBe(src);
    expect(script?.async).toBe(true);
    first.unmount();
    render(<ReviewsSection />);
    expect(document.querySelectorAll(selector)).toHaveLength(1);
    expect(document.body.querySelector(selector)).toBe(script);
  });

  it.each(["head", "body"] as const)("reuses the existing platform script in document.%s", (location) => {
    const existing = document.createElement("script");
    existing.src = src;
    document[location].appendChild(existing);
    render(<ReviewsSection />);
    expect(document.querySelectorAll(selector)).toHaveLength(1);
    expect(document.querySelector(selector)).toBe(existing);
  });
});