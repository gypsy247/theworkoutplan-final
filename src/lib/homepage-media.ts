export const FACILITY_IMAGE_MAX = 1600;
export const FACILITY_IMAGE_QUALITY = 0.80;
export const FACILITY_KEYS = ["facilityImage", "panoramicImageUrl", "facilityImageUrl", "facilityPhotoUrl", "studioPanoramicUrl"] as const;

export function facilityImageUrl(site: object): string {
  const fields = site as Record<string, unknown>;
  for (const key of FACILITY_KEYS) {
    const value = fields[key];
    if (typeof value === "string" && value.trim() && !value.startsWith("blob:")) return value.trim();
  }
  return "";
}

export function trainingVideoSource(value: string): { kind: "embed" | "file"; src: string } {
  const src = value.trim();
  try {
    const url = new URL(src);
    const host = url.hostname.replace(/^www\./, "");
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host)) {
      const id = host === "youtu.be" ? url.pathname.split("/")[1] : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
      if (id && /^[\w-]+$/.test(id)) return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` };
    }
    if (["vimeo.com", "player.vimeo.com"].includes(host)) {
      const id = url.pathname.match(/(?:^|\/)(\d+)(?:\/|$)/)?.[1];
      if (id) {
        const embed = new URL(`https://player.vimeo.com/video/${id}`);
        embed.searchParams.set("autoplay", "1");
        const hash = url.searchParams.get("h") || url.pathname.match(/\/\d+\/([\w]+)$/)?.[1];
        if (hash) embed.searchParams.set("h", hash);
        return { kind: "embed", src: embed.toString() };
      }
    }
  } catch { /* Relative paths and uploaded data URLs are direct video sources. */ }
  return { kind: "file", src };
}

// Keep small clips self-contained in the existing JSON publishing flow.
export async function readVideoUpload(file: File): Promise<string> {
  if (!file.type.startsWith("video/") && !/\.(mp4|mov|webm)$/i.test(file.name)) throw new Error("Choose an MP4, MOV or WebM video.");
  if (file.size > 3 * 1024 * 1024) throw new Error("For videos larger than 3 MB, paste a hosted video or YouTube/Vimeo link instead.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result.replace(/^data:;base64,/, "data:video/mp4;base64,")) : reject(new Error("Unable to read video."));
    reader.onerror = () => reject(new Error("Unable to read video."));
    reader.readAsDataURL(file);
  });
}