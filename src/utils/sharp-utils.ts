import fs from "fs";
import { HttpError } from "./http-error";
import sharp from "sharp";
import path from "path";

const SharpUtils = {
  // Función que obtiene la resolución de la imagen original
  getMetadataImage: async (imagePath: string): Promise<sharp.Metadata> => {
    try {
      const metadata = await sharp(imagePath).metadata();
      return metadata;
    } catch (error) {
      throw new HttpError("Error in obtaining image resolution", 500);
    }
  },

  // Función para redimensionar la imagen
  resizeToVariants: async (imagePath: string) => {
    try {
      const variants = [1024, 800];

      const ext = path.extname(imagePath);
      const baseName = path.basename(imagePath, ext);
      const dir = path.dirname(imagePath);

      const resolutionsDir = path.join(dir, "resolutions");

      const generatedPaths: { resolution: string; path: string }[] = [];

      if (!fs.existsSync(resolutionsDir)) {
        fs.mkdirSync(resolutionsDir, { recursive: true });

        for (const width of variants) {
          const variantDir = path.join(resolutionsDir, `${width}`);
          fs.mkdirSync(variantDir);

          const outPath = path.join(variantDir, `${baseName}_${width}${ext}`);
          await sharp(imagePath).resize({ width }).toFile(outPath);

          generatedPaths.push({
            resolution: width.toString(),
            path: outPath
          });
        }

        return {
          success: true,
          variants: generatedPaths
        };
      }

      for (const width of variants) {
        const variantDir = path.join(resolutionsDir, `${width}`);
        const outPath = path.join(variantDir, `${baseName}_${width}${ext}`);

        if (!fs.existsSync(variantDir)) {
          fs.mkdirSync(variantDir);
        }

        if (!fs.existsSync(outPath)) {
          await sharp(imagePath).resize({ width }).toFile(outPath);
          generatedPaths.push({
            resolution: width.toString(),
            path: outPath
          });
        }
      }

      return {
        success: true,
        variants: generatedPaths
      };
    } catch (error) {
      return {
        success: false,
        error: error || "Unexpected error during image resizing"
      };
    }
  }
};

export default SharpUtils;
