
import express from 'express';
import morgan from 'morgan';
import routes from './routes/routes';
import errorHandler from './middlewares/error-handler';
import { HttpError } from './utils/http-error';


const app = express();

// Configuración de la aplicación
app.use(morgan("dev"));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
routes(app);

// Middlewares
// Rutas no encontradas
app.use((req, res, next) => {
    const error = new HttpError("Not Found", 404);
    next(error);
  });

// Manejar errores
app.use(errorHandler)

export default app;
