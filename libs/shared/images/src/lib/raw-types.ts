export interface RawProfilePicture {
  id?: unknown;
  owner_id?: unknown;
  url_token?: unknown;
  width?: unknown;
  height?: unknown;
  rating?: unknown;
  is_public?: unknown;
}

export interface RawProfileResponse {
  id?: unknown;
  name?: unknown;
  online_status?: unknown;
  headline?: unknown;
  preview_pic?: RawProfilePicture | null;
  pictures?: unknown;
}
