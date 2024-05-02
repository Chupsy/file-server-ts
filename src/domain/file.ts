export interface File {
  id?: number;
  filename: string;
  data?: Buffer;
  mimeType?: string;
}
