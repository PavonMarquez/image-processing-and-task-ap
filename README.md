# Image Processing and Task API

API REST desarrollada para gestionar tareas de procesamiento de imágenes. Permite subir imágenes locales o desde URL, generar variantes redimensionadas manteniendo el aspect ratio, y consultar el estado de las tareas creadas.

---

## 📁 Organización del proyecto

Se ha seguido una separación por **capas** para mantener claridad y modularidad:

- `controllers/`: controladores de las rutas
- `routes/`: definición de endpoints
- `services/`: lógica de negocio principal
- `databases/mongoServices/`: acceso a base de datos con Mongoose
- `models/`: esquemas de MongoDB
- `utils/`: funciones auxiliares reutilizables
- `configs/`: configuración de entorno y conexión a MongoDB
- `middlewares/`: middlewares como el manejador de errores
- `docs/`: documentación con Swagger
- `__tests__/`: pruebas unitarias y de integración

Aunque no se aplicó una arquitectura hexagonal formal, sí se separaron responsabilidades para facilitar el mantenimiento, pruebas y extensibilidad.

---

## 🛠️ Tecnologías utilizadas

### Lenguaje y framework
- Node.js + TypeScript
- Express.js

### Base de datos
- MongoDB 

### Procesamiento de imágenes
- Sharp

### Documentación
- Swagger

### Pruebas
- Jest
- Supertest

### Entorno
- Docker (para MongoDB)

### Utilidades adicionales
- Axios – para descargar imágenes desde URL
- dotenv + env-var – manejo seguro de variables de entorno
- moment – para formateo de fechas
- morgan – logger de peticiones HTTP

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para clonar, configurar y ejecutar la aplicación:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu_usuario/image-processing-and-task-api.git
   cd image-processing-and-task-api
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear archivo de entorno**

   Clona el archivo `.env.example` como `.env` y verifica que los valores sean correctos:
   ```bash
   cp .env.example .env
   ```

4. **Levantar base de datos MongoDB con Docker**
   ```bash
   docker compose up -d
   ```

5. **Indexar datos de ejemplo en la base de datos**
   ```bash
   npx ts-node init-db.ts
   ```

6. **Levantar el servidor**
   - En entorno de producción:
     ```bash
     npm start
     ```
   - En entorno de desarrollo:
     ```bash
     npm run dev
     ```

---

La API está disponible en: [http://localhost:4000](http://localhost:4000)

---

## 📖 Documentación Swagger

Disponible en: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## 🧪 Pruebas

```bash
npm test
```

Se incluyen:

- ✅ Tests unitarios
- ✅ Tests de integración

---

## ✅ Funcionalidades principales

- Crear tareas a partir de una imagen (desde una URL o un path local).
- Procesar la imagen redimensionándola a 1024px y 800px, manteniendo su proporción.
- Almacenar los metadatos de la imagen original y de sus variantes generadas.
- Actualizar el estado de la tarea automáticamente según el resultado del procesamiento.
- Consultar el estado de una tarea y obtener las variantes generadas (solo si el procesamiento fue exitoso).
- Documentación interactiva disponible a través de Swagger UI.


---

## 📦 Ejemplos de uso

Una vez levantada la API, puedes probar el endpoint `POST /tasks` con los siguientes ejemplos:

## 🔹 1. Imagen desde **path local**

 - "public/images/b6c4f99ebc0cec07eac2d98133094f54/b6c4f99ebc0cec07eac2d98133094f54.jpg"

 - "public/images/f8905bd3df64ace64a68e154ba72f24c/f8905bd3df64ace64a68e154ba72f24c.jpg"


## 🔹 2. Imagen desde **URL**
  -  "https://wallpapershome.com/images/pages/pic_h/1533.jpg"

  -  "https://wallpapershome.com/images/pages/pic_h/1537.jpg"

---

