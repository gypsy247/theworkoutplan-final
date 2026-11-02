export type IdentityUser = { email?: string; jwt: (force?: boolean) => Promise<string> };
export type IdentityWidget = {
  currentUser: () => IdentityUser | null;
  init: () => void;
  open: (tab?: string) => void;
  close: () => void;
  logout: () => Promise<void>;
  on: (event: string, callback: (user?: IdentityUser) => void) => void;
  off: (event: string, callback: (user?: IdentityUser) => void) => void;
};
declare global { interface Window { netlifyIdentity?: IdentityWidget } }

let initialized = false;
export function initializeIdentity(widget: IdentityWidget) {
  if (initialized) return;
  initialized = true;
  widget.init();
}