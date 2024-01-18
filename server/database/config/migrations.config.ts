import createConfig from "./database.config";

const development = createConfig(process.env.NODE_ENV || 'development');
const production = createConfig(process.env.NODE_ENV || 'production');

module.exports = {
  development,
  production
};
