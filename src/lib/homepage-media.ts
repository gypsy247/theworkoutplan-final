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

export function normalizeVideoUrl(raw: string): string {
  const value = raw.trim();
  return !value || /^(?:https?:\/\/|\/|data:video\/)/i.test(value) ? value : `https://${value}`;
}

export type VideoEmbedInfo =
  | { kind: "embed"; provider: "youtube" | "vimeo"; src: string; openUrl: string }
  | { kind: "file"; src: string; openUrl: string }
  | { kind: "unsupported"; src: ""; openUrl: string }
  | { kind: "empty"; src: ""; openUrl: "" };

export function getVideoEmbedInfo(value: string): VideoEmbedInfo {
  const src = normalizeVideoUrl(value);
  if (!src) return { kind: "empty", src: "", openUrl: "" };
  if (/^data:video\//i.test(src)) return { kind: "file", src, openUrl: src };
  try {
    const url = new URL(src, "https://video-path.invalid");
    if (!["https:", "http:"].includes(url.protocol)) return { kind: "unsupported", src: "", openUrl: "" };
    const host = url.hostname.replace(/^www\./, "");
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host)) {
      const id = host === "youtu.be" ? url.pathname.split("/")[1] : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
      if (id && /^[\w-]{11}$/.test(id)) return { kind: "embed", provider: "youtube", src: `https://www.youtube.com/embed/${id}?rel=0`, openUrl: `https://www.youtube.com/watch?v=${id}` };
    }
    if (["vimeo.com", "player.vimeo.com"].includes(host)) {
      const id = url.pathname.match(/(?:^|\/)(\d+)(?:\/|$)/)?.[1];
      if (id) {
        const embed = new URL(`https://player.vimeo.com/video/${id}`);
        const hash = url.searchParams.get("h") || url.pathname.match(/\/\d+\/([\w]+)$/)?.[1];
        if (hash) embed.searchParams.set("h", hash);
        return { kind: "embed", provider: "vimeo", src: embed.toString(), openUrl: `https://vimeo.com/${id}${hash ? `/${hash}` : ""}` };
      }
    }
    if (/\.(mp4|mov|webm)$/i.test(url.pathname)) return { kind: "file", src, openUrl: src };
    return { kind: "unsupported", src: "", openUrl: src };
  } catch { return { kind: "unsupported", src: "", openUrl: "" }; }
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