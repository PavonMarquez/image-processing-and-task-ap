import { TaskType } from "../../types/task-types";
import TaskModel from "../../models/task-model";
import { Types } from "mongoose";
import { HttpError } from "../../utils/http-error";

export const TaskMongoService = {
  saveImage: async (data: TaskType.TaskData) => {
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
      throw error;
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
  }
};
