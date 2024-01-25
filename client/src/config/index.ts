interface Config {
  salt: string;
  apiUrl: string;
}

export const config: Config = {
  salt: process.env.SECRET_SALT || "secretKey",
  apiUrl: process.env.API_URL || "http://localhost:8080",
};
