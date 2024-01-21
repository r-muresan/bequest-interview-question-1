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
    define: {
      charset: string;
      collate: string;
    }
    dialectOptions: {
      charset: string;
    }
  };
}

export default function createConfig(env: string): Config {
  return {
    username: getEnvVar('DB_USERNAME') ?? '',
    password: getEnvVar('DB_PASSWORD') ?? '',
    database: getEnvVar('DB_NAME') ?? '',
    host: getEnvVar('DB_HOSTNAME') ?? '',
    dialect: 'mysql',
    logging: (sql: string, timing?: number) => {
      console.log(`SQL Query: ${sql}`);
      if (timing) {
        console.log(`Execution Time: ${timing}ms`);
      }
    }, 
    options: {
      host: getEnvVar('DB_HOSTNAME') ?? '',
      dialect: 'mysql',
      connectionTimeout: parseInt(getEnvVar('TIMEOUT') || '15000'),
      requestTimeout: parseInt(getEnvVar('TIMEOUT') || '15000'),
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
      dialectOptions: {
        charset: 'utf8mb4', // or the correct charset for your database
      },
  }
  };
}