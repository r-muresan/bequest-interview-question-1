import { Sequelize, Model, Options, ModelAttributes, Attributes, ModelCtor } from 'sequelize';

import config from './database.config';

class Database {
  private sequelize: Sequelize;
  envoriment: string;

  constructor() {
    
    this.sequelize = new Sequelize(
      config.database ?? '', 
      config.username ?? '', 
      config.password ?? '', 
      config.options as Options
    );
    this.envoriment = process.env.NODE_ENV ?? 'development';
  }

  getSequelize(): Sequelize {
    return this.sequelize;
  }

  getModel<T extends Model<any, any>>(name: string, attributes: ModelAttributes<T, Attributes<T>>): ModelCtor<T> {
    return this.sequelize.define<T>(name, attributes);
  }

  connect(): void {
    this.sequelize.authenticate()
      .then(() => {
        console.log(`Connection has been established successfully.`);
      })
      .catch((err: Error) => {
        console.error('Unable to connect to the database:', err);
      });
  }
}

export default new Database();;