const ADMIN_TOKEN_KEY = "ww_admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}
export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}
export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> ?? {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Google Drive URL converter ───────────────────────────────────────────────

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;

  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) {
    return `https://lh3.googleusercontent.com/d/${driveOpenMatch[1]}`;
  }

  const driveUcMatch = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (driveUcMatch) {
    return `https://lh3.googleusercontent.com/d/${driveUcMatch[1]}`;
  }

  return url;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
  coverImageUrl: string | null;
  bestTimeToVisit: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationWithPhotos extends Destination {
  photos: GalleryPhoto[];
}

export interface GalleryPhoto {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  destinationId: number | null;
  destinationName: string | null;
}

export interface BucketListItem {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  completed: boolean;
  createdAt: string;
}

export interface SiteStats {
  posts: number;
  destinations: number;
  photos: number;
  bucketTotal: number;
  bucketDone: number;
}

// ─── Public fetchers ─────────────────────────────────────────────────────────

export const fetchPosts = () => apiFetch<BlogPost[]>("/api/posts");
export const fetchPost = (slug: string) => apiFetch<BlogPost>(`/api/posts/${slug}`);
export const fetchDestinations = () => apiFetch<Destination[]>("/api/destinations");
export const fetchDestination = (slug: string) =>
  apiFetch<DestinationWithPhotos>(`/api/destinations/${slug}`);
export const fetchGallery = () => apiFetch<GalleryPhoto[]>("/api/gallery");
export const fetchBucketList = () => apiFetch<BucketListItem[]>("/api/bucket-list");
export const fetchStats = () => apiFetch<SiteStats>("/api/stats");
export const fetchSiteSettings = () => apiFetch<Record<string, string>>("/api/site-settings");
export const subscribe = (email: string) =>
  apiFetch<{ ok: boolean }>("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });

// ─── Admin fetchers ───────────────────────────────────────────────────────────

export const adminFetchPosts = () => apiFetch<BlogPost[]>("/api/admin/posts");
export const adminFetchDestinations = () => apiFetch<Destination[]>("/api/admin/destinations");
export const adminFetchGallery = () => apiFetch<GalleryPhoto[]>("/api/admin/gallery");
export const adminFetchBucketList = () => apiFetch<BucketListItem[]>("/api/admin/bucket-list");
export const adminFetchSiteSettings = () => apiFetch<Record<string, string>>("/api/admin/site-settings");

export const adminLogin = (email: string, password: string) =>
  apiFetch<{ ok: boolean; email: string; token: string }>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const adminLogout = () =>
  apiFetch<{ ok: boolean }>("/api/admin/auth/logout", { method: "POST" });

export const adminMe = () =>
  apiFetch<{ email: string }>("/api/admin/auth/me");

export const adminCreatePost = (data: Partial<BlogPost>) =>
  apiFetch<BlogPost>("/api/admin/posts", { method: "POST", body: JSON.stringify(data) });

export const adminUpdatePost = (id: number, data: Partial<BlogPost>) =>
  apiFetch<BlogPost>(`/api/admin/posts/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeletePost = (id: number) =>
  apiFetch<void>(`/api/admin/posts/${id}`, { method: "DELETE" });

export const adminCreateDestination = (data: Partial<Destination>) =>
  apiFetch<Destination>("/api/admin/destinations", { method: "POST", body: JSON.stringify(data) });

export const adminUpdateDestination = (id: number, data: Partial<Destination>) =>
  apiFetch<Destination>(`/api/admin/destinations/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteDestination = (id: number) =>
  apiFetch<void>(`/api/admin/destinations/${id}`, { method: "DELETE" });

export const adminAddPhoto = (data: { imageUrl: string; caption?: string; destinationId?: number | null }) =>
  apiFetch<GalleryPhoto>("/api/admin/gallery", { method: "POST", body: JSON.stringify(data) });

export const adminDeletePhoto = (id: number) =>
  apiFetch<void>(`/api/admin/gallery/${id}`, { method: "DELETE" });

export const adminCreateBucketListItem = (data: Partial<BucketListItem>) =>
  apiFetch<BucketListItem>("/api/admin/bucket-list", { method: "POST", body: JSON.stringify(data) });

export const adminUpdateBucketListItem = (id: number, data: Partial<BucketListItem>) =>
  apiFetch<BucketListItem>(`/api/admin/bucket-list/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteBucketListItem = (id: number) =>
  apiFetch<void>(`/api/admin/bucket-list/${id}`, { method: "DELETE" });

export const adminSaveSiteSettings = (data: Record<string, string>) =>
  apiFetch<{ ok: boolean }>("/api/admin/site-settings", { method: "PUT", body: JSON.stringify(data) });

// ─── Storage ──────────────────────────────────────────────────────────────────

export async function requestUploadUrl(file: File): Promise<{ uploadURL: string; objectPath: string }> {
  return apiFetch("/api/storage/uploads/request-url", {
    method: "POST",
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  });
}

export async function uploadFileToStorage(file: File): Promise<string> {
  const { uploadURL, objectPath } = await requestUploadUrl(file);
  await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  return `/api/storage${objectPath}`;
}
