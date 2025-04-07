import fs from "fs";
import { HttpError } from "./http-error";
import sharp from "sharp";
import path from "path";
import logger from "./logger";

const SharpUtils = {

  getMetadataImage: async (imagePath: string): Promise<sharp.Metadata> => {
    try {
      const metadata = await sharp(imagePath).metadata();
      return metadata;
    } catch (error) {
      logger.error(`Failed to get image metadata for: ${imagePath}`, error);
      throw new HttpError("Error in obtaining image resolution", 500);
    }
  },


  resizeToVariants: async (imagePath: string) => {
    try {
      const variants = [1024, 800];
  
      const ext = path.extname(imagePath);
      const baseName = path.basename(imagePath, ext);
      const dir = path.dirname(imagePath);
  
      const resolutionsDir = path.join(dir, "resolutions");
  
      if (!fs.existsSync(resolutionsDir)) {
        fs.mkdirSync(resolutionsDir, { recursive: true });
      }
  
      const generatedPaths: { resolution: string; path: string }[] = [];
  
      for (const width of variants) {
        const variantDir = path.join(resolutionsDir, `${width}`);
        if (!fs.existsSync(variantDir)) {
          fs.mkdirSync(variantDir);
        }
  
        const outPath = path.join(variantDir, `${baseName}_${width}${ext}`);
  
        if (!fs.existsSync(outPath)) {
          await sharp(imagePath).resize({ width }).toFile(outPath);
        }
  
        generatedPaths.push({
          resolution: width.toString(),
          path: outPath
        });
      }
  
      return {
        success: true,
        variants: generatedPaths
      };
    } catch (error) {
      logger.error("Error resizing image variants", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error during image resizing"
      };
    }
  }
  
};

export default SharpUtils;
