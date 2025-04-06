import type { Express, Request, Response } from 'express'
import packageJson from "../../package.json";
import { TaskController } from '../controllers/tasks-controller';



const APP_NAME = packageJson.name;
const VERSION = packageJson.version;

export default (app: Express) => {

    app.get("/status", function status(req: Request, res: Response) {
        res.json({
          app: APP_NAME,
          version: VERSION,
        });
      });

      app.post("/tasks", TaskController.createTask)
}