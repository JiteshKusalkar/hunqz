export interface ProfileImage {
  id: string;
  imageUrl: string;
}

export interface Profile {
  id: string;
  name: string;
  onlineStatus: string | null;
  headline: string | null;
  previewImage: ProfileImage | null;
  images: ProfileImage[];
}

export type RawProfilePicture = {
  id?: string;
  owner_id?: string;
  url_token?: string;
};

export type RawProfileResponse = {
  id?: string;
  name?: string;
  online_status?: string;
  headline?: string;
  preview_pic?: RawProfilePicture | null;
  pictures?: RawProfilePicture[];
};

export type ProfileImageBase = {
  id: string;
  urlToken: string;
};

export type ProfileBase = {
  id: string;
  name: string;
  onlineStatus: string | null;
  headline: string | null;
  previewImage: ProfileImageBase | null;
  images: ProfileImageBase[];
};
