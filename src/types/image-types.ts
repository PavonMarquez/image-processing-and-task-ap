import sharp from 'sharp';

export namespace ImageType {
  export type ImageData = {
    path: string;
    name: string;
    metadataImage: sharp.Metadata;
  };

  export type NewImage = {
    originalPath: string;
    fileName: string;
    originalResolution: string;
    format?: string;
  };
}