import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize,
} from "sequelize";

import db from "../../../../database/database";

class Block extends Model<
  InferAttributes<Block>,
  InferCreationAttributes<Block>
> {
  declare id: CreationOptional<number>;
  declare index: number;
  declare timestamp: string;
  declare data: string;
  declare previousHash: string;
  declare hash: string;
}

Block.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    index: {
      type: DataTypes.BIGINT,
      field: "index",
    },
    timestamp: {
      type: DataTypes.DATE,
      field: "timestamp",
    },
    data: {
      type: DataTypes.STRING(254),
      field: "data",
    },
    previousHash: {
      type: DataTypes.STRING(254),
      field: "previousHash",
    },
    hash: {
      type: DataTypes.STRING(254),
      field: "hash",
    },
  },
  {
    tableName: "blockchain",
    sequelize: db.getSequelize(),
    timestamps: false,
  }
);

export default Block;