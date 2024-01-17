import * as dotenv from 'dotenv';
dotenv.config();

type EnvVars = {
  NODE_ENV: string;
  MODEL_VERSION: string;
  PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOSTNAME: string;
  TIMEOUT: string;
  API_KEY: string;
};

export default function getEnvVar<K extends keyof EnvVars>(key: K): EnvVars[K] {
  const value = process.env[key];
  if (typeof value === 'undefined') {
      throw new Error(`Environment variable ${key} is not set`);
  }
  return value as EnvVars[K];
}
