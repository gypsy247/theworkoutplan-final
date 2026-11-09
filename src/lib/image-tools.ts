import siteContent from "@/data/siteContent.json";

export const FALLBACK_IMAGE = "/images/trainer-izzy-boxing.jpg";

const RAW_GITHUB_IMAGE = /^https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/(.+)$/;

/**
 * Rewrites raw.githubusercontent.com photo URLs to the same-origin image proxy so photos
 * load even while the GitHub repository is private (raw URLs 404 in the browser).
 */
export function resolveImageUrl(url: string): string {
  const match = RAW_GITHUB_IMAGE.exec(url);
  if (!match) return url;
  return `/.netlify/functions/admin-publish?action=image&path=${encodeURIComponent(match[1]!)}`;
}

/** Resize to max 1000px and compress to a self-contained JPEG data URL (quality 0.75). */
export async function compressImage(file: File, max = 1000, quality = 0.75): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", quality);
}

export function isBrokenImage(src: unknown): boolean {
  return typeof src !== "string" || !src.trim() || src.startsWith("blob:") || src.includes("/uploads/");
}

type Site = typeof siteContent;

/** Replaces blob:/empty/missing image references with bundled defaults; refills an empty gallery. */
export function sanitizeSite<T extends Site>(site: T): T {
  const s = structuredClone(site);
  if (!Array.isArray(s.studioPhotos) || s.studioPhotos.length === 0) s.studioPhotos = structuredClone(siteContent.studioPhotos);
  s.studioPhotos.forEach((p, i) => { if (isBrokenImage(p.image)) p.image = siteContent.studioPhotos[i % siteContent.studioPhotos.length]!.image; });
  if (!Array.isArray(s.appScreenshots) || s.appScreenshots.length === 0) s.appScreenshots = structuredClone(siteContent.appScreenshots);
  s.appScreenshots.forEach((p, i) => { if (isBrokenImage(p.image)) p.image = siteContent.appScreenshots[i % siteContent.appScreenshots.length]!.image; });
  (s.trainers ?? []).forEach((t) => { if (isBrokenImage(t.image)) t.image = siteContent.trainers.find(d => d.name === t.name)?.image ?? FALLBACK_IMAGE; });
  if (isBrokenImage(s.studioInfo?.logoImage)) s.studioInfo.logoImage = siteContent.studioInfo.logoImage;
  if (typeof s.facilityImage === "string" && s.facilityImage.startsWith("blob:")) s.facilityImage = "";
  s.studioPhotos.forEach((p) => { p.image = resolveImageUrl(p.image); });
  s.appScreenshots.forEach((p) => { p.image = resolveImageUrl(p.image); });
  (s.trainers ?? []).forEach((t) => { t.image = resolveImageUrl(t.image); });
  if (typeof s.studioInfo?.logoImage === "string") s.studioInfo.logoImage = resolveImageUrl(s.studioInfo.logoImage);
  if (typeof s.facilityImage === "string" && s.facilityImage) s.facilityImage = resolveImageUrl(s.facilityImage);
  return s;
}

/** Any <img> that fails to load swaps once to a bundled studio photo instead of showing a broken box. */
export function installImageFallback() {
  if (typeof window === "undefined") return;
  window.addEventListener("error", (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.dataset["fallbackApplied"]) return;
    img.dataset["fallbackApplied"] = "1";
    img.src = img.dataset["fallback"] || FALLBACK_IMAGE;
  }, true);
}
