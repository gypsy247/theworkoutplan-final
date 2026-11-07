import type { LiveContent } from "@/lib/live-content";

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
export function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14 8V6.5c0-.8.2-1.3 1.4-1.3H17V2.2C16.7 2.1 15.7 2 14.6 2 12.2 2 10.6 3.4 10.6 6.1V8H8v3.4h2.6V22H14V11.4h2.7L17.1 8H14z" />
    </svg>
  );
}
export function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.1-2.8V9.2a6.2 6.2 0 1 0 5.4 6.2V8.6a7.8 7.8 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.7z" />
    </svg>
  );
}

export function getSocialList(site: LiveContent["site"]) {
  return [
    { label: "Instagram", handle: "@theworkoutplant", href: site.studioInfo.instagramUrl, Icon: InstagramIcon },
    { label: "Facebook", handle: "TheWorkoutPlant", href: site.studioInfo.facebookUrl, Icon: FacebookIcon },
    { label: "TikTok", handle: "@theworkoutplant", href: site.studioInfo.tiktokUrl, Icon: TikTokIcon },
  ];
}
