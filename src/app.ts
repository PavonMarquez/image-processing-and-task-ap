import { envs } from './configs/env-var';
import app from './server';
import connectDB from './configs/conection-mongodb';
import logger from './utils/logger';

(async () => {
  try {
    await connectDB();
    app.listen(envs.PORT, () => {
      logger.info(`Server running on port ${envs.PORT}`);
    });
  } catch (err) {
    logger.info('Could not start the server:', err);
    process.exit(1);
  }
})();
