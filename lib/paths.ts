/** Build-time mount path; empty for localhost, /personal-website for Pages. */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');
if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath)) throw new Error('NEXT_PUBLIC_BASE_PATH must be empty or a slash-prefixed path without a trailing slash.');
export function withBasePath(url: string): string {
  if (!basePath || !url.startsWith('/') || url.startsWith('//') || url === basePath || url.startsWith(`${basePath}/`) || url.startsWith(`${basePath}?`) || url.startsWith(`${basePath}#`)) return url;
  return `${basePath}${url}`;
}
export function stripBasePath(pathname: string): string {
  if (basePath && pathname === basePath) return '/';
  return basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
}
