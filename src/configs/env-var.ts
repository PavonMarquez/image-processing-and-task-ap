import 'dotenv/config';
import env from 'env-var';


export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  MONGO_URL: env.get('MONGO_URL').required().asString(),
  MONGO_INITDB_DATABASE: env.get('MONGO_INITDB_DATABASE').required().asString(),
  MONGO_INITDB_USERNAME: env.get('MONGO_INITDB_USERNAME').required().asString(),
  MONGO_INITDB_PASSWORD: env.get('MONGO_INITDB_PASSWORD').required().asString(),
}