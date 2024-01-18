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
        type: DataTypes.DATE
      },
      data: {
        type: DataTypes.JSON
      },
      previousHash: {
        type: DataTypes.STRING(64)
      },
      hash: {
        type: DataTypes.STRING(64)
      }
    });
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('blockchain');
  }
};
