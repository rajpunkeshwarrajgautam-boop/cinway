// Auth protection is handled via NextAuth middleware in production.
export { default } from "next-auth/middleware";
export const config = { matcher: ["/", "/profiles"] };
