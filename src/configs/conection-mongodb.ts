import mongoose from 'mongoose';
import { envs } from './env-var';

const connectDB = async () => {
  try {
    const { MONGO_INITDB_USERNAME, MONGO_INITDB_PASSWORD, MONGO_URL, MONGO_INITDB_DATABASE } = envs;
    const connectionString = `mongodb://${MONGO_INITDB_USERNAME}:${MONGO_INITDB_PASSWORD}@${MONGO_URL}/${MONGO_INITDB_DATABASE}?authSource=admin`;


    await mongoose.connect(connectionString);

    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err);
    throw new Error('No se pudo conectar a la base de datos');
  }
};

export default connectDB;
