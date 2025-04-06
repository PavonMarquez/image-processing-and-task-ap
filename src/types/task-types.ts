import { Types } from "mongoose";

export namespace TaskType {
  export type TaskData = {
    status: string;
    price: number;
    imageId: Types.ObjectId;
  };

  export type TaskResponse = {
    taskId: string;
    status: "pending" | "completed" | "failed";
    price: number;
    images?: {
      resizedVariants: {
        resolution: string;
        path: string;
      }[];
    };
  };
}
