import { Types } from "mongoose";
import { ImageType } from "../../types/image-types";

export interface ImageRepository {
  saveImage(data: ImageType.NewImage): Promise<Types.ObjectId>;
  updateImage(data: { imageId: Types.ObjectId; variants: { resolution: string; path: string }[] }): Promise<void>;
}