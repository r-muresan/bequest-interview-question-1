import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('blockchain', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      index: {
        type: DataTypes.BIGINT
      },
      timestamp: {
        type: DataTypes.STRING
      },
      data: {
        type: DataTypes.STRING
      },
      previousHash: {
        type: DataTypes.STRING
      },
      hash: {
        type: DataTypes.STRING
      }
    });
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('blockchain');
  }
};
