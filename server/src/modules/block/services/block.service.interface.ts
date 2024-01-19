import Block from "../models/block.model";
import { InferAttributes, WhereOptions } from "sequelize"

export interface IBlockService {
  getBlockById(id: number): Promise<Block | null>;
  getBlockWhere(where: WhereOptions<InferAttributes<Block, {omit:never}>>): Promise<Block | null>;
  addBlock(block: Block): Promise<Block>;
  getBlocks(): Promise<Block[]>;
  countBlocks(): Promise<number>;
}