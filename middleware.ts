// Middleware is disabled for static export (Firebase Hosting).
// Auth protection is handled client-side via the useSession hook.
// To re-enable server-side protection, remove output: 'export' from next.config.mjs
// and uncomment the lines below:

// export { default } from "next-auth/middleware";
// export const config = { matcher: ["/", "/profiles"] };

export function middleware() {}
export const config = { matcher: [] };
