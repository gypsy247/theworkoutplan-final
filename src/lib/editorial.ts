import defaults from "@/data/siteContent.json";
import { useLiveContent } from "@/lib/live-content";

export type EditorialCopy = typeof defaults.editorial;
export const DEFAULT_EDITORIAL: EditorialCopy = defaults.editorial;

/** Merge published editorial copy over bundled defaults so older published content without it still renders. */
export function mergeEditorial(value: Partial<EditorialCopy> | undefined): EditorialCopy {
  const d = DEFAULT_EDITORIAL;
  return {
    hero: { ...d.hero, ...value?.hero },
    consultation: { ...d.consultation, ...value?.consultation },
    pricing: { ...d.pricing, ...value?.pricing },
  };
}

export function useEditorial(): EditorialCopy {
  return mergeEditorial((useLiveContent().site as { editorial?: Partial<EditorialCopy> }).editorial);
}
