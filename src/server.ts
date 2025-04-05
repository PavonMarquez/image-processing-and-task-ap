
import express from 'express';
import morgan from 'morgan';
import routes from './routes/routes';



const app = express();

// Configuración de la aplicación
app.use(morgan("dev"));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
routes(app);



export default app;
