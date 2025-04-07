import { TaskRepository } from "../../domain/repositories/task-repository";
import { Types } from "mongoose";
import { HttpError } from "../../utils/http-error";
import { TaskType } from "../../types/task-types";
import TaskModel from "../../models/task-model";
import ImageModel from "../../models/image-model";

export class TaskRepositoryMongo implements TaskRepository {
    
  async getTaskWithImage(taskId: string): Promise<TaskType.TaskResponse> {
    const task = await TaskModel.findById(new Types.ObjectId(taskId));
    if (!task) throw new HttpError("Task not found", 404);

    const image = await ImageModel.findById(task.imageId);
    if (!image) throw new HttpError("Image not found", 404);

    const variants = image.resizedVariants?.filter(v => v.resolution && v.path) || [];

    return {
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
  }

  async updateTaskStatus(data: { taskId: string; status: "failed" | "completed" }): Promise<void> {
    const { taskId, status } = data;
  
    const task = await TaskModel.findById(taskId);
    if (!task) throw new HttpError("Task not found", 404);
  
    await TaskModel.findByIdAndUpdate(taskId, { status });
  }

  async saveTask(data: TaskType.TaskData): Promise<TaskType.TaskResponse> {
    const newTask = new TaskModel({
      status: data.status,
      price: data.price,
      imageId: data.imageId
    });
  
    const saved = await newTask.save();
  
    return {
      taskId: saved._id.toString(),
      price: saved.price,
      status: saved.status
    };
  }
}


export const taskRepositoryMongo = new TaskRepositoryMongo();