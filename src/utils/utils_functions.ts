import { createHash } from "crypto";
import path from "path";
import fs from "fs";
import axios from "axios";
import { HttpError } from "./http-error";
import SharpUtils from "./sharp-utils";
import sharp from "sharp";

const utilsFunctions = {
  randomPrice: (max: number = 50): number => {
    const min = 5;
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  },

  getFileNameWithHash: (filePath: string): string => {
    const fileExtension = path.extname(filePath);

    const fileName = path.basename(filePath, fileExtension);
    const hash = createHash("md5").update(fileName).digest("hex");

    return `${hash}${fileExtension}`;
  },

  downloadImage: async (url: string): Promise<{ pathImage: string; fileName: string; metadata: sharp.Metadata }> => {
    try {
      const IMAGE_DIR = path.join(__dirname, "../public/images");

      // 1. Descargar imagen
      const response = await axios.get(url, { responseType: "arraybuffer" });

      // 2. Obtener info del archivo
      const fileName = path.basename(new URL(url).pathname);
      const imageName = path.basename(fileName, path.extname(fileName));
      const contentType = response.headers["content-type"];
      const mimeToExt: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
      };
      const ext = path.extname(fileName) || mimeToExt[contentType] || ".jpg";

      // 3. Hash para carpeta y archivo
      const hash = utilsFunctions.getFileNameWithHash(imageName);
      const hashedFileName = hash + ext;
      const imageFolder = path.join(IMAGE_DIR, hash);
      const filePath = path.join(imageFolder, hashedFileName);

      // 4. Comprobar si existe, y devolvemos metadata sin reescribir
      if (fs.existsSync(filePath)) {
        const metadataImage = await SharpUtils.getMetadataImage(filePath);
        const relativePath = path.join("src", path.relative(path.join(__dirname, ".."), filePath));
        return { pathImage: relativePath, fileName: hashedFileName, metadata: metadataImage };
      }

      // 5. Si no existe, creamos las carpetas
      if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
      if (!fs.existsSync(imageFolder)) fs.mkdirSync(imageFolder, { recursive: true });

      // 6. Guardar imagen
      fs.writeFileSync(filePath, response.data);

      // 7. Obtener metadata
      const metadataImage = await SharpUtils.getMetadataImage(filePath);
      const relativePath = path.join("src", path.relative(path.join(__dirname, ".."), filePath));

      return { pathImage: relativePath, fileName: hashedFileName, metadata: metadataImage };
    } catch (error) {
      throw new HttpError("Failed to download and store image", 500);
    }
  }
};

export default utilsFunctions;
