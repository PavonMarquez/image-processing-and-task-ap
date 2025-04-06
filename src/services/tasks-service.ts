import utilsFunctions from "../utils/utils_functions";
import SharpUtils from "../utils/sharp-utils";
import { ImageType } from "../types/image-types";
import { ImageMongoService } from "../databases/mongoServices/image-mongoService";
import { TaskType } from "../types/task-types";
import { TaskMongoService } from "../databases/mongoServices/task-mongoService";
import { Types } from "mongoose";
import { HttpError } from "../utils/http-error";

export const TaskService = {
  createTask: async (path: string, typePath: string) => {
    try {
      if (!path || !typePath) throw new Error("Missing parameters");

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
      throw error;
    }
  },

  saveImage: async (data: ImageType.ImageData) => {
    try {
      const newImage = {
        originalPath: data.path,
        fileName: data.name,
        originalResolution: `${data.metadataImage.width}x${data.metadataImage.height}`,
        format: data.metadataImage.format
      };

      const saveImage = await ImageMongoService.saveImage(newImage);

      return saveImage;
    } catch (error) {
      throw error;
    }
  },

  saveTask: async (data: TaskType.TaskData) => {
    try {
      const newTask = {
        status: data.status,
        price: data.price,
        imageId: data.imageId
      };
      const saveTask = await TaskMongoService.saveImage(newTask);

      return saveTask;
    } catch (error) {}
  },

  processTask: async ({
    imagePath,
    taskId,
    imageId
  }: {
    imagePath: string;
    taskId: Types.ObjectId;
    imageId: Types.ObjectId;
  }) => {
    try {
      let status: "failed" | "completed" = "failed";

      // Simulamos que el procesamiento de imagen tarda,
      // para reflejar que esta parte se ejecuta en segundo plano.
      await new Promise(resolve => setTimeout(resolve, 15000));

      const { success, variants } = await SharpUtils.resizeToVariants(imagePath);

      if (success) {
        status = "completed";

        if (variants && variants.length > 0) {
          ImageMongoService.updateImage({ imageId, variants });
        }
      }

      TaskMongoService.updateTask({ taskId, status });
    } catch (error) {
      throw new HttpError("Failed to process image variants and update task", 500);
    }
  },

  getTaskById: async (taskId: string): Promise<TaskType.TaskResponse> => {
    try {
      const task = await TaskMongoService.getTaskById(taskId);

      if (!task) throw new HttpError("Task not found", 404);

      const image = await ImageMongoService.getImageById(task.imageId);
      if (!image) throw new HttpError("Image not found", 404);

      const variants = image.resizedVariants?.filter(v => v.resolution && v.path) || [];

      const response: TaskType.TaskResponse = {
        taskId: task._id.toString(),
        status: task.status ?? "pending",
        price: task.price,
        ...(variants.length > 0 && {
          images: {
            resizedVariants: variants.map(v => ({
              resolution: v.resolution!,
              path: v.path!
            }))
          }
        })
      };
  
      return response;
    } catch (error) {
      throw error;
    }
  }
};
