import fs from "fs";
import path from "path";
import { HttpError } from "./http-error";

export const validate = {

  isString: (value: string): boolean => {
    return typeof value === "string";
  },

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  },

  isValidPath(inputPath: string): boolean {
    try {
      // Paso 1: Validar estructura del path
      const localPathRegex = /^src\/public\/images\/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+\.(jpg|jpeg|png)$/;
      const matchesStructure = localPathRegex.test(inputPath);
  
      if (!matchesStructure) {
        throw new HttpError("Invalid path structure.", 400);
      }
  
      // Paso 2: Verificar si el archivo existe
      const resolvedPath = path.resolve(inputPath);
  
      if (!fs.existsSync(resolvedPath)) {
        throw new HttpError("File not found.", 404);
      }
  
      return true;
  
    } catch (error) {
      throw error;
    }
  },
  
  isValidInput: (input: string): string => {
    try {

      if (!validate.isString(input)) return "invalid";

      const isValidUrl = validate.isValidUrl(input);
      if (isValidUrl) return "URL";

      const isValidPath = validate.isValidPath(input);

      if (isValidPath) return "PathLocal";

      return "invalid";
    } catch (error) {
      throw error;
    }
  }
};
