import type { Express, Request, Response } from 'express'
import packageJson from "../../package.json";
import { TaskController } from "../controllers/tasks-controller";

const APP_NAME = packageJson.name;
const VERSION = packageJson.version;

export default (app: Express) => {
  /**
 * @openapi
 * /status:
 *   get:
 *     summary: Get the status of the application
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Returns app name and version
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 app:
 *                   type: string
 *                   example: image-processing-and-task-api
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
  app.get("/status", function status(req: Request, res: Response) {
    res.json({
      app: APP_NAME,
      version: VERSION
    });
  });

  /**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Create a new task to process an image
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target
 *             properties:
 *               target:
 *                 type: string
 *                 description: Image URL or local path to be processed
 *                 example: "https://s1.1zoom.me/big3/117/423843-Kycb.jpg"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   example: "67f2cd3305efde7e186d764f"
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed]
 *                   example: "pending"
 *                 price:
 *                   type: number
 *                   example: 21.95
 *       400:
 *         description: Bad request (missing parameters)
 *       500:
 *         description: Internal server error
 */
  app.post("/tasks", TaskController.createTask);

  /**
 * @openapi
 * /tasks/{taskId}:
 *   get:
 *     summary: Retrieve task details by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   example: "67f2cd3305efde7e186d764f"
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed]
 *                   example: "completed"
 *                 price:
 *                   type: number
 *                   example: 41.09
 *                 image:
 *                   type: object
 *                   properties:
 *                     resizedVariants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           resolution:
 *                             type: string
 *                             example: "1024"
 *                           path:
 *                             type: string
 *                             example: "src/public/images/hash123/resolutions/1024/hash123_1024.jpg"
 *       404:
 *         description: Task or image not found
 *       500:
 *         description: Internal server error
 */
  app.get("/tasks/:taskId", TaskController.getTaskById);
};
