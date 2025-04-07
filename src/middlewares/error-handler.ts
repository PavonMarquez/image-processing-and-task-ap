import { Request, Response, NextFunction } from "express";
import { ErrorLog } from "../models/log-model";
import logger from "../utils/logger";

const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`, err);

  try {
    const timestamp = new Date();
    const localTimestamp = new Date(timestamp.getTime() - timestamp.getTimezoneOffset() * 60000);

    await ErrorLog.create({
      message: err.message,
      stack_trace: err.stack,
      status_code: err.status || 500,
      endpoint: req.originalUrl,
      method: req.method,
      timestamp: localTimestamp
    });
  } catch (dbError) {
    logger.error('Failed to log error in database', dbError);
  }

  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
};

export default errorHandler;
