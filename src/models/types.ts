export interface Folder {
  name: string;
  path: string;
  featured?: Image;
}

export interface Image {
  asset_id: string;
  public_id: string;
  folder: string;
  filename: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: Date;
  uploaded_at: Date;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  url: string;
  secure_url: string;
  status: string;
  access_mode: string;
  access_control: null;
  etag: string;
  created_by: DateStamp;
  uploaded_by: DateStamp;
}

export interface DateStamp {
  access_key: string;
  custom_id: string;
  external_id: string;
}
