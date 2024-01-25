interface Config {
  salt: string;
}

export const config: Config = {
  salt: process.env.SECRET_SALT || "secretKey"
};
