import { Types } from "mongoose";
import { HttpError } from "../../utils/http-error";
import { ImageType } from "../../types/image-types";
import ImageModel from "../../models/image-model";
import logger from "../../utils/logger";

export const ImageMongoService = {
  saveImage: async (data: ImageType.NewImage) => {
    try {
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
    } catch (error) {
      logger.error('Failed to save image in MongoDB', error);
      throw new HttpError('Failed to save image', 500);
    }
  },

  updateImage: async ({
    imageId,
    variants
  }: {
    imageId: Types.ObjectId;
    variants: { resolution: string; path: string }[];
  }) => {
    try {
      const imageDb = await ImageModel.findById(imageId);

      const existingResolutions = imageDb!.resizedVariants.map(v => v.resolution);

      const newVariants = variants.filter(v => !existingResolutions.includes(v.resolution));

      if (newVariants.length > 0) {
        await ImageModel.findByIdAndUpdate(imageId, {
          $push: { resizedVariants: { $each: newVariants } }
        });
      }

      return {
        status: "completed",
        updatedImage: true
      };
    } catch (error) {
      logger.error("Failed to update image with resized variants", error);
      throw new HttpError("Failed to update image with resized variants", 500);
    }
  },

  getImageById: async (imageId: Types.ObjectId) => {
    try {
      return await ImageModel.findById(imageId);
    } catch (error) {
      logger.error("Failed to fetch image by ID", error);
      throw new HttpError("Error fetching image from database", 500);
    }
  }
};
