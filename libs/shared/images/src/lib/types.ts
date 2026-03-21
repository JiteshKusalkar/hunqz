/**
 * Raw-mapped image data as produced by mapRawProfile.
 * Does NOT contain imageUrl — the API server resolves and injects
 * the internal image route before sending the response to clients.
 */
export interface ProfileImageBase {
  id: string;
  urlToken: string;
  width: number | null;
  height: number | null;
  rating: string | null;
  isPublic: boolean | null;
}

/**
 * Profile image as returned by the API server to clients.
 * imageUrl is always an internal server route (/images/256x256/{token}.jpg),
 * never the upstream CDN URL.
 */
export interface ProfileImage extends ProfileImageBase {
  imageUrl: string;
}

/**
 * Raw-mapped profile as produced by mapRawProfile.
 * Images use ProfileImageBase (no imageUrl yet).
 */
export interface ProfileBase {
  id: string;
  name: string;
  onlineStatus: string | null;
  headline: string | null;
  previewImage: ProfileImageBase | null;
  images: ProfileImageBase[];
}

/**
 * Full profile as returned by the API server to clients.
 * All image URLs are resolved internal routes.
 */
export interface Profile {
  id: string;
  name: string;
  onlineStatus: string | null;
  headline: string | null;
  previewImage: ProfileImage | null;
  images: ProfileImage[];
}
