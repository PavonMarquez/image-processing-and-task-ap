import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    index: true
  },
  price: {
    type: Number,
    required: true,
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  }
},
{
  timestamps: true
});

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel;