import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/tasks-service";
import { validate } from "../utils/validation-utils";
import { HttpError } from "../utils/http-error";

export const TaskController = {
  createTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const target = req.body.target;

      if (!target) throw new HttpError("Target is required", 400);

      const typePath = validate.isValidInput(target);
      if (typePath === "invalid") throw new HttpError("Invalid input. Must be a valid URL or path", 400);

      const task = await TaskService.createTask(target, typePath);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
};
