export interface RawProfilePicture {
  id?: string;
  owner_id?: string;
  url_token?: string;
}

export interface RawProfileResponse {
  id?: string;
  name?: string;
  online_status?: string;
  headline?: string;
  preview_pic?: RawProfilePicture | null;
  pictures?: RawProfilePicture[];
}
