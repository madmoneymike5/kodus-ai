export const APP_BASE_PATH = (
    process.env.NEXT_PUBLIC_APP_BASE_PATH ?? ""
).replace(/\/$/, "");

export function withAppBasePath(path: string): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${APP_BASE_PATH}${normalized}` || "/";
}
