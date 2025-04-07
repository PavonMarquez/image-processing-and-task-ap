import { TaskType } from "../../types/task-types";
import TaskModel from "../../models/task-model";
import { Types } from "mongoose";
import { HttpError } from "../../utils/http-error";
import logger from "../../utils/logger";

export const TaskMongoService = {
  saveTask: async (data: TaskType.TaskData) => {
    try {
      const newTask = new TaskModel({
        status: data.status,
        price: data.price,
        imageId: data.imageId
      });
  
      const saveTask = await newTask.save();
  
      return {
        taskId: saveTask._id,
        price: saveTask.price,
        status: saveTask.status
      };
    } catch (error) {
      logger.error('Failed to save task in MongoDB', error);
      throw new HttpError('Failed to save task', 500);
    }
  },

  updateTask: async ({ taskId, status }: { taskId: Types.ObjectId; status: "completed" | "failed" }) => {
    try {
      const taskDb = await TaskModel.findById(taskId);
      if (!taskDb) throw new HttpError("Task not found", 404);

      await TaskModel.findByIdAndUpdate(taskId, { status });
    } catch (error) {
      throw new HttpError("Failed to update task status", 500);
    }
  },

  getTaskById: async (taskId: string) => {
    try {
      const task = await TaskModel.findById(new Types.ObjectId(taskId));
      return task;
    } catch (error) {
      logger.error("Failed to fetch task by ID", error);
      throw new HttpError("Error fetching task from database", 500);
    }
  }
};
