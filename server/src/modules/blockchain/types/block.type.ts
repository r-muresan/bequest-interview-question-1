import { BlockData } from "./block.data.type";

export type BlockType = {
  index: number;
  timestamp: string;
  data: BlockData;
  previousHash: string;
  hash: string;
}