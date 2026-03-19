export interface ProfileImage {
  id: string;
  urlToken: string;
  imageUrl: string;
  width: number | null;
  height: number | null;
  rating: string | null;
  isPublic: boolean | null;
}

export interface Profile {
  id: string;
  name: string;
  onlineStatus: string | null;
  headline: string | null;
  previewImage: ProfileImage | null;
  images: ProfileImage[];
}

export interface FetchProfileOptions {
  baseUrl?: string;
  profileName?: string;
  signal?: AbortSignal;
}
