// export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// // Generate login URL at runtime so redirect URI reflects the current origin.
// export const getLoginUrl = () => {
//   const oauthPortalUrl =
//     process.env.NEXT_PUBLIC_OAUTH_PORTAL_URL ??
//     // fallback for legacy VITE_* usage
//     ((typeof import !== "undefined" && (import.meta as any)?.env?.VITE_OAUTH_PORTAL_URL) as string | undefined);
//   const appId =
//     process.env.NEXT_PUBLIC_APP_ID ??
//     ((typeof import !== "undefined" && (import.meta as any)?.env?.VITE_APP_ID) as string | undefined);
//   const redirectUri = `${window.location.origin}/api/oauth/callback`;
//   const state = btoa(redirectUri);

//   const url = new URL(`${oauthPortalUrl}/app-auth`);
//   url.searchParams.set("appId", appId);
//   url.searchParams.set("redirectUri", redirectUri);
//   url.searchParams.set("state", state);
//   url.searchParams.set("type", "signIn");

//   return url.toString();
// };
