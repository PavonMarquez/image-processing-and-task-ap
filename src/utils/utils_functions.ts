import { createHash } from "crypto";
import path from "path";
import fs from "fs";
import axios from "axios";
import { HttpError } from "./http-error";
import SharpUtils from "./sharp-utils";
import sharp from "sharp";
import logger from "./logger";

const utilsFunctions = {
  randomPrice: (max: number = 50): number => {
    const min = 5;
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  },

  getFileNameWithHash: (filePath: string): string => {
    if (!filePath) throw new HttpError("Invalid file path", 400);
  
    const fileExtension = path.extname(filePath);
    const fileName = path.basename(filePath, fileExtension);
    const hash = createHash("md5").update(fileName).digest("hex");
  
    return `${hash}${fileExtension}`;
  },

  downloadImage: async (url: string): Promise<{ pathImage: string; fileName: string; metadata: sharp.Metadata }> => {
    try {
      const IMAGE_DIR = path.join(process.cwd(), "public", "images");

      const response = await axios.get(url, { responseType: "arraybuffer" });

      const fileName = path.basename(new URL(url).pathname);
      const imageName = path.basename(fileName, path.extname(fileName));
      const contentType = response.headers["content-type"];

      if (!contentType) {
        logger.warn(`No content-type found in response headers for URL: ${url}`);
      }

      const mimeToExt: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
      };

      const extensionFromMime = contentType ? mimeToExt[contentType] : undefined;

      if (contentType && !extensionFromMime) {
        logger.warn(`Unrecognized content-type (${contentType}) from URL: ${url}. Defaulting to .jpg`);
      }

      const ext = path.extname(fileName) || extensionFromMime || ".jpg";

      const hash = utilsFunctions.getFileNameWithHash(imageName);
      const hashedFileName = hash + ext;
      const imageFolder = path.join(IMAGE_DIR, hash);
      const filePath = path.join(imageFolder, hashedFileName);

      if (!fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder, { recursive: true });
      }

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, response.data);
      }

      const metadataImage = await SharpUtils.getMetadataImage(filePath);
      const relativePath = path.relative(process.cwd(), filePath);

      return { pathImage: relativePath, fileName: hashedFileName, metadata: metadataImage };
    } catch (error) {
      logger.error(`Error downloading image from URL: ${url}`, error);
      throw new HttpError("Failed to download and store image", 500);
    }
  }
};

export default utilsFunctions;
