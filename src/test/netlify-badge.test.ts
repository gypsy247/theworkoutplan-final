import { describe, expect, it } from "vitest";

import { removeNetlifyBadge } from "@/lib/netlify-badge";

const BADGE = '<iframe id="nl-badge-frame" title="Powered by Netlify"></iframe>';
const HUD = '<iframe id="nl-hud-frame" title="Netlify"></iframe>';
const INJECTED_TAG =
  '<script data-nf-variant="public" data-account-tier="free" src="/.netlify/scripts/hud?variant=public"></script>';

function mountBadge() {
  document.body.innerHTML = `<main><h1>The Workout Plant</h1></main>${BADGE}${HUD}${INJECTED_TAG}`;
}

describe("Netlify badge removal", () => {
  it("drops the injected badge, the owner toolbar and the injecting tag", () => {
    mountBadge();
    removeNetlifyBadge();
    expect(document.getElementById("nl-badge-frame")).toBeNull();
    expect(document.getElementById("nl-hud-frame")).toBeNull();
    expect(document.querySelector("script[data-nf-variant]")).toBeNull();
    expect(document.querySelector("main h1")?.textContent).toBe("The Workout Plant");
  });

  it("drops a badge Netlify injects after the page has loaded", async () => {
    mountBadge();
    removeNetlifyBadge();
    document.body.insertAdjacentHTML("beforeend", BADGE);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.getElementById("nl-badge-frame")).toBeNull();
  });

  it("leaves the site's own frames alone", async () => {
    mountBadge();
    document.body.insertAdjacentHTML(
      "beforeend",
      '<iframe title="Watch How We Train" src="https://www.youtube.com/embed/Br6lr4_MdGs?rel=0"></iframe>',
    );
    removeNetlifyBadge();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector('iframe[title="Watch How We Train"]')).not.toBeNull();
  });
});
