import getEnvVar from "../../src/getEnvVar";

export interface Config {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mssql' | 'mariadb';
  logging?: boolean | ((sql: string, timing?: number) => void);
  options: {
    host: string;
    connectionTimeout: number;
    requestTimeout: number;
    dialect: string;
    timezone: string;
    dialectOptions: {
      encrypt: boolean;
    };
  };
}

export default function createConfig(env: string): Config {
  return {
    username: getEnvVar('DB_USERNAME') ?? '',
    password: getEnvVar('DB_PASSWORD') ?? '',
    database: getEnvVar('DB_NAME') ?? '',
    host: getEnvVar('DB_HOSTNAME') ?? '',
    dialect: 'mysql',
    logging: console.log, 
    options: {
      host: getEnvVar('DB_HOSTNAME') ?? '',
      dialect: 'mysql',
      connectionTimeout: parseInt(getEnvVar('TIMEOUT') || '15000'),
      requestTimeout: parseInt(getEnvVar('TIMEOUT') || '15000'),
      timezone: 'America/Sao_Paulo',
      dialectOptions: {
        encrypt: env === 'production'
      }
    }
  };
}