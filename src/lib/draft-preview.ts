export const DRAFT_MESSAGE = "workout-plant:draft";
export const PREVIEW_READY = "workout-plant:preview-ready";
export const previewViewports = [
  { id: "desktop", label: "Desktop", width: 1280 },
  { id: "mobile", label: "Mobile", width: 375 },
] as const;

export function isDraftPreview(search: string): boolean {
  return new URLSearchParams(search).get("preview") === "draft";
}