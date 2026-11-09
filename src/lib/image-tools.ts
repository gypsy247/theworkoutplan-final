import siteContent from "@/data/siteContent.json";

export const FALLBACK_IMAGE = "/images/trainer-izzy-boxing.jpg";

/** Resize to max 1200px and compress (WebP, JPEG fallback, 0.78) into a self-contained data URL. */
export async function compressImage(file: File, max = 1200, quality = 0.78): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  let url = canvas.toDataURL("image/webp", quality);
  if (!url.startsWith("data:image/webp")) url = canvas.toDataURL("image/jpeg", quality);
  return url;
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
