import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
  fileName: {
    type: String,
    required: true
  },
  originalPath: {
    type: String,
    required: true
  },
  originalResolution: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  resizedVariants: [
    {
      resolution: String,
      path: String
    }
  ],
},
{
  timestamps: true
});

const ImageModel = mongoose.model("Image", imageSchema);
export default ImageModel;
