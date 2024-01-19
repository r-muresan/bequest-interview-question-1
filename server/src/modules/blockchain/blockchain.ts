import { BlockFactory } from "../block/block.factory";
import Block from "../block/models/block.model";
import { BlockService } from '../block/services/block.service';
import { BlockData } from "./types/block.data.type";
import { calculateHash } from "../../utils/calculate.hash";
import getEnvVar from "../../getEnvVar";

export class Blockchain {
  private blockService: BlockService;
  static blockFactory: BlockFactory;
  private chain: Block[];

  constructor(
    private blockFactory: BlockFactory
  ) {
    this.blockService = this.blockFactory.getBlockService();
    this.chain = [new Block({
      index: 1,
      timestamp: getEnvVar('GENESIS_BLOCK_TIMESTAMP'),
      data: JSON.stringify({"data": "Genesis Block"}),
      previousHash: getEnvVar('GENESIS_BLOCK_PREVIOUS_HASH'),
      hash: getEnvVar('GENESIS_BLOCK_HASH')
    })];
  }

  public async addBlock(data: BlockData): Promise<Block> {
    await this.reloadChain();
    const lastBlock = this.chain[this.chain.length - 1];
    const newIndex = lastBlock.index + 1;
    const stringfyData = JSON.stringify(data);
    const newTimestamp = new Date().toUTCString()
    console.log('newTimestamp', newTimestamp)
    const newHash = calculateHash(newIndex, newTimestamp, stringfyData, lastBlock.hash);
    console.log(newIndex+newTimestamp+stringfyData+ lastBlock.hash);
    const newBlock = { 
      index: newIndex, 
      timestamp: newTimestamp, 
      data: stringfyData, 
      previousHash: lastBlock.hash, 
      hash: newHash 
    };
    return await this.blockService.addBlock(newBlock);
  }

  public async isChainValid(): Promise<boolean> {
    await this.reloadChain();
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const precedingBlock = this.chain[i - 1];

      
      const formatedDate = currentBlock.timestamp.replace(' ', 'T') + 'Z';
      const timestamp = new Date(formatedDate).toUTCString();

      console.log(currentBlock.index+timestamp+ currentBlock.data+currentBlock.previousHash)
      console.log(currentBlock.data, typeof currentBlock.data)
      console.log(JSON.stringify(currentBlock.data))
      
      const hashProof = calculateHash(currentBlock.index, timestamp, JSON.stringify(currentBlock.data), currentBlock.previousHash)

      if (currentBlock.hash !== hashProof) {
        console.log("currentBlock", currentBlock.h, "hashProof", hashProof);
        return false;
      }

      if (currentBlock.previousHash !== precedingBlock.hash) {
        return false;
      }
    }

    return true;
  }

  public async reloadChain(): Promise<void> {
    this.chain = await this.blockService.getBlocks();
  }

  public async getChain(): Promise<Block[]> {
    await this.reloadChain();
    return this.chain;
  }

  public async getLastBlock() {
    await this.reloadChain();
    return this.chain[this.chain.length - 1];
  }
  
}