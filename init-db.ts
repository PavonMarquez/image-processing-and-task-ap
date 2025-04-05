import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import moment from 'moment';

const { MONGO_INITDB_DATABASE, MONGO_INITDB_USERNAME, MONGO_INITDB_PASSWORD } = process.env;
// Variables de conexión (puedes definirlas en el .env si prefieres)
const mongoURI = `mongodb://${MONGO_INITDB_USERNAME}:${MONGO_INITDB_PASSWORD}@localhost:27017/${MONGO_INITDB_DATABASE}?authSource=admin`;

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Conectado a MongoDB');

    // Definir los esquemas de las colecciones
    const imageSchema = new mongoose.Schema({
      nameFile: String,
      originalPath: String,
      originalResolution: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      images: [{
        resolution: String,
        path: String
      }]
    });

    const taskSchema = new mongoose.Schema({
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        index: true,
      },
      price: Number,
      imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      
    });

    const Image = mongoose.model('Image', imageSchema);
    const Task = mongoose.model('Task', taskSchema);

    // Obtener la fecha local en formato ISO
    const localDate = moment().local().toISOString();

    // Insertar documentos en la colección 'images'
    const imageDoc1 = await Image.create({
      nameFile: "531481a702d1d1948c4dd78341d499d6.jpg",
      originalPath: "src/public/images/example1/531481a702d1d1948c4dd78341d499d6.jpg",
      originalResolution: "3840x2160",
      createdAt: localDate,
      updatedAt: localDate
    });

    const imageDoc2 = await Image.create({
      nameFile: "c55ba87fefe1a5cbf9a936594aaeb8ce.jpg",
      originalPath: "src/public/images/example2/c55ba87fefe1a5cbf9a936594aaeb8ce.jpg",
      originalResolution: "6000x4000",
      images: [
        {
          resolution: "1024",
          path: "src/public/images/example2/resolutions/1024/c55ba87fefe1a5cbf9a936594aaeb8ce1024px.jpg"
        }
      ],
      createdAt: localDate,
      updatedAt: localDate
    });

    // Insertar documentos en la colección 'tasks' con las referencias a 'imageId'
    await Task.create({
      status: "pending",
      price: 25.5,
      imageId: imageDoc1._id,
      createdAt: localDate,
      updatedAt: localDate
    });

    await Task.create({
      status: "completed",
      price: 30.5,
      imageId: imageDoc2._id,
      createdAt: localDate,
      updatedAt: localDate
    });

    console.log('Datos insertados correctamente');
    process.exit();
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1);
  });