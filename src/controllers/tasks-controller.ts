import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/tasks-service";

export const TaskController = {
  createTask: async (req: Request, res: Response, next: NextFunction) => {
    const task = await TaskService.createTask();
    res.status(201).json(task);
  }
};
