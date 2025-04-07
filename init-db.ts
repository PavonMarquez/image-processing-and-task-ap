import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import moment from "moment";
import logger from "./src/utils/logger";

const { MONGO_INITDB_DATABASE, MONGO_INITDB_USERNAME, MONGO_INITDB_PASSWORD, MONGO_URL } = process.env;
const mongoURI = `mongodb://${MONGO_INITDB_USERNAME}:${MONGO_INITDB_PASSWORD}@${MONGO_URL}/${MONGO_INITDB_DATABASE}?authSource=admin`;

mongoose
  .connect(mongoURI)
  .then(async () => {

    logger.info("Conectado a MongoDB")
    
    const imageSchema = new mongoose.Schema({
      fileName: String,
      originalPath: String,
      originalResolution: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      images: [
        {
          resolution: String,
          path: String
        }
      ]
    });

    const taskSchema = new mongoose.Schema({
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        index: true
      },
      price: Number,
      imageId: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const Image = mongoose.model("Image", imageSchema);
    const Task = mongoose.model("Task", taskSchema);

    const localDate = moment().local().toISOString();

    const exampleData = [
      {
        fileName: "01b0d1b5a3812eded622df653d3cd482.jpg",
        folder: "public/images/01b0d1b5a3812eded622df653d3cd482/01b0d1b5a3812eded622df653d3cd482.jpg",
        resolution: "800x450",
        status: "completed",
        price: 32.5,
        variants: [
          {
            resolution: "800",
            path: 'public/images/01b0d1b5a3812eded622df653d3cd482/resolutions/800/01b0d1b5a3812eded622df653d3cd482_800.jpg'
          },{
            resolution: "1024",
            path: 'public/images/01b0d1b5a3812eded622df653d3cd482/resolutions/1024/01b0d1b5a3812eded622df653d3cd482_1024.jpg'
          }
        ]
      },
      {
        fileName: "b05b64b135c654deacc33cf7c4a8aeb5.jpg",
        folder: "public/images/b05b64b135c654deacc33cf7c4a8aeb5/b05b64b135c654deacc33cf7c4a8aeb5.jpg",
        resolution: "800x450",
        status: "completed",
        price: 45.7,
        variants: [
          {
            resolution: "800",
            path: 'public/images/b05b64b135c654deacc33cf7c4a8aeb5/resolutions/800/b05b64b135c654deacc33cf7c4a8aeb5_800.jpg'
          },{
            resolution: "1024",
            path: 'public/images/b05b64b135c654deacc33cf7c4a8aeb5/resolutions/1024/b05b64b135c654deacc33cf7c4a8aeb5_1024.jpg'

          }
        ]
      },
    ];

    for (const item of exampleData) {
      const image = await Image.create({
        fileName: item.fileName,
        originalPath: `public/images/${item.folder}/${item.fileName}.jpg`,
        originalResolution: item.resolution,
        images: item.variants.map(v => ({
          resolution: v.resolution,
          path: `public/images/${item.folder}/${v.path}`
        })),
        createdAt: localDate,
        updatedAt: localDate
      });

      await Task.create({
        status: item.status,
        price: item.price,
        imageId: image._id,
        createdAt: localDate,
        updatedAt: localDate
      });
    }

    logger.info("Datos de ejemplo insertados correctamente");
    process.exit();
  })
  .catch(err => {
    logger.error("Error al conectar a MongoDB,", err);
    process.exit(1);
  });
