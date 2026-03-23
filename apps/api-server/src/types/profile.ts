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
