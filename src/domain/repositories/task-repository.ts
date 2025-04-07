

import { TaskType } from "../../types/task-types";

export interface TaskRepository {
  getTaskWithImage(taskId: string): Promise<TaskType.TaskResponse>;
  updateTaskStatus(data: { taskId: string; status: "failed" | "completed" }): Promise<void>;
  saveTask(data: TaskType.TaskData): Promise<TaskType.TaskResponse>;
}