import utilsFunctions from "../utils/utils_functions";
import SharpUtils from "../utils/sharp-utils";
import { ImageType } from "../types/image-types";

import { TaskType } from "../types/task-types";

import { Types } from "mongoose";
import { HttpError } from "../utils/http-error";
import logger from "../utils/logger";

import { taskRepositoryMongo as taskRepo } from "../infrastructure/mongo/task-repository-mongo";
import { imageRepositoryMongo as imageRepo } from "../infrastructure/mongo/image-repository.mongo";

export const TaskService = {
  createTask: async (path: string, typePath: string) => {
    try {
      if (!path || !typePath) throw new HttpError("Missing parameters", 400);

      let imagePath = path;
      let imageData;

      if (typePath === "URL") {
        const downloaded = await utilsFunctions.downloadImage(path);
        imagePath = downloaded.pathImage;
        imageData = {
          path: downloaded.pathImage,
          metadataImage: downloaded.metadata,
          name: utilsFunctions.getFileNameWithHash(imagePath)
        };
      } else {
        imageData = {
          path: imagePath,
          metadataImage: await SharpUtils.getMetadataImage(imagePath),
          name: utilsFunctions.getFileNameWithHash(imagePath)
        };
      }

      const imageId = await TaskService.saveImage(imageData);

      const newTask = {
        status: "pending",
        price: utilsFunctions.randomPrice(),
        imageId: imageId
      };
      const taskSave = await TaskService.saveTask(newTask);

      TaskService.processTask({ imagePath: imageData.path, taskId: taskSave!.taskId, imageId: imageId });

      return taskSave;
    } catch (error) {
      logger.error("Internal error while creating task", error);
      throw new HttpError("Failed to create task", 500);
    }
  },

  saveImage: async (data: ImageType.ImageData) => {
    try {
      const { path, name, metadataImage } = data;

      if (!metadataImage.width || !metadataImage.height || !metadataImage.format) {
        throw new HttpError("Incomplete metadata received", 400);
      }

      const newImage = {
        originalPath: data.path,
        fileName: data.name,
        originalResolution: `${data.metadataImage.width}x${data.metadataImage.height}`,
        format: data.metadataImage.format
      };

      const saveImage = await imageRepo.saveImage(newImage);

      return saveImage;
    } catch (error) {
      logger.error("Failed to save image", error);
      throw new HttpError("Internal error while saving image", 500);
    }
  },

  saveTask: async (data: TaskType.TaskData) => {
    try {
      const newTask = {
        status: data.status,
        price: data.price,
        imageId: data.imageId
      };

      const saveTask = await taskRepo.saveTask(newTask);

      return saveTask;
    } catch (error) {
      logger.error("Failed to save task", error);
      throw new HttpError("Internal error while saving task", 500);
    }
  },

  processTask: async ({
    imagePath,
    taskId,
    imageId
  }: {
    imagePath: string;
    taskId: string;
    imageId: Types.ObjectId;
  }) => {
    try {
      let status: "failed" | "completed" = "failed";

      // Simulamos que el procesamiento de imagen tarda,
      // para reflejar que esta parte se ejecuta en segundo plano.
      await new Promise(resolve => setTimeout(resolve, 20000));

      const { success, variants } = await SharpUtils.resizeToVariants(imagePath);

      if (success) {
        status = "completed";

        if (variants && variants.length > 0) {
          try {
            await imageRepo.updateImage({ imageId, variants });
          } catch (err) {
            logger.error(`Error updating image variants in DB. imageId: ${imageId}`, err);
          }
        }
      }

      try {
        await taskRepo.updateTaskStatus({ taskId, status });
      } catch (err) {
        logger.error(`Error updating task status. taskId: ${taskId}`, err);
      }

      logger.info(`Task ${taskId} processed with status: ${status}`);
    } catch (err) {
      logger.error("Unexpected error in processTask", err);
    }
  },

  getTaskById: async (taskId: string): Promise<TaskType.TaskResponse> => {
    try {
      const taskWithImage = await taskRepo.getTaskWithImage(taskId);

      return taskWithImage;
    } catch (error) {
      logger.error("Failed to retrieve task by ID", error);
      throw new HttpError("Internal server error while retrieving task", 500);
    }
  }
};
