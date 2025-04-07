import { ImageRepository } from "../../domain/repositories/image-repository";
import ImageModel from "../../models/image-model";
import { Types } from "mongoose";
import { HttpError } from "../../utils/http-error";
import { ImageType } from "../../types/image-types";

export class ImageRepositoryMongo implements ImageRepository {
  async saveImage(data: ImageType.NewImage): Promise<Types.ObjectId> {
    const imageDb = await ImageModel.findOne({ fileName: data.fileName });
    if (imageDb) return imageDb._id;

    const newImage = new ImageModel({
      originalPath: data.originalPath,
      fileName: data.fileName,
      originalResolution: data.originalResolution,
      format: data.format
    });

    await newImage.save();
    return newImage._id;
  }

  async updateImage({
    imageId,
    variants
  }: {
    imageId: Types.ObjectId;
    variants: { resolution: string; path: string }[];
  }): Promise<void> {
    const updated = await ImageModel.findByIdAndUpdate(imageId, {
      resizedVariants: variants
    });

    if (!updated) throw new HttpError("Failed to update image", 500);
  }
}

export const imageRepositoryMongo = new ImageRepositoryMongo();
