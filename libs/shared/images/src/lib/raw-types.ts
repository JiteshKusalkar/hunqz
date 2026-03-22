export interface RawProfilePicture {
  id?: string;
  owner_id?: string;
  url_token?: string;
  width?: number;
  height?: number;
  rating?: string;
  is_public?: boolean;
}

export interface RawProfileResponse {
  id?: string;
  name?: string;
  online_status?: string;
  headline?: string;
  preview_pic?: RawProfilePicture | null;
  pictures?: RawProfilePicture[];
}
