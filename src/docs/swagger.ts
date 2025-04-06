// src/docs/swagger.ts

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { envs } from '../configs/env-var';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Image Processing and Task API',
      version: '1.0.0',
      description: 'API to process images and create tasks asynchronously',
    },
    servers: [
      {
        url: `http://localhost:${envs.PORT}`,
      },
    ],
  },
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
