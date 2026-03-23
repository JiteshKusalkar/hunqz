export interface ProfileImageBase {
  id: string;
  urlToken: string;
}

export interface ProfileImage {
  id: string;
  imageUrl: string;
}

export interface ProfileBase {
  id: string;
  name: string;
  onlineStatus: string | null;
  headline: string | null;
  previewImage: ProfileImageBase | null;
  images: ProfileImageBase[];
}

export interface Profile {
  id: string;
  name: string;
  onlineStatus: string | null;
  headline: string | null;
  previewImage: ProfileImage | null;
  images: ProfileImage[];
}
