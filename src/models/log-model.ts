import { Schema, model, Document } from 'mongoose';

interface ErrorLogInterface extends Document {
  timestamp: Date;
  status_code: number;
  message: string;
  endpoint: string;
  method: string;
}

const errorLogSchema = new Schema<ErrorLogInterface>({
  endpoint: { type: String, required: true },
  status_code: { type: Number, required: true, index: true },
  message: { type: String, required: true },
  method: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const ErrorLog = model<ErrorLogInterface>('Log', errorLogSchema);

export { ErrorLog };
