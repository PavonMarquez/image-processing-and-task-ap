import { Types } from 'mongoose';



export namespace TaskType {

  export type TaskData = {
    status: string;
    price: number;
    imageId: Types.ObjectId
  };
}