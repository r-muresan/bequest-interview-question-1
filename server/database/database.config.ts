import getEnvVar from "../getEnvVar";

type Config = {
  username: string;
  password: string;
  database: string;
  options: {
    host: string;
    connectionTimeout: string;
    requestTimeout: string;
    dialect: string;
    timezone: string;
    dialectOptions: {
      encrypt: boolean;
    }
  }
};

const config: Config = {
  username: getEnvVar('DB_USERNAME') ?? '',
  password: getEnvVar('DB_PASSWORD') ?? '',
  database: getEnvVar('DB_NAME') ?? '', 
  options: {
    host: getEnvVar('DB_HOSTNAME') ?? '',
    connectionTimeout: getEnvVar('TIMEOUT') ?? '15000',
    requestTimeout: getEnvVar('TIMEOUT') ?? '15000',
    dialect: 'mysql',
    timezone: 'America/Sao_Paulo',
    dialectOptions: {
      encrypt: false
    }
  }
};

export default config;