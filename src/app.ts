import { envs } from './configs/env-var';
import app from './server';
import connectDB from './configs/conection-mongodb';

(async () => {
  try {
    await connectDB();
    app.listen(envs.PORT, () => {
      console.log(`Server running on port ${envs.PORT}`);
    });
  } catch (err) {
    console.log('Could not start the server:', err);
    process.exit(1);
  }
})();
