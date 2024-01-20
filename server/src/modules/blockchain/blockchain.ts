import { BlockFactory } from "../block/block.factory";
import Block from "../block/models/block.model";
import { BlockService } from '../block/services/block.service';
import { BlockData } from "./types/block.data.type";
import crypto from 'crypto';

export class Blockchain {
  private blockService: BlockService;
  private chain: Block[];
  private static instance: Blockchain;

  private constructor(
    private blockFactory: BlockFactory
  ) {
    this.blockService = this.blockFactory.getBlockService();
    this.chain = [new Block({
      index: 0,
      timestamp: '',
      data: JSON.stringify({"data": "Genesis Block"}),
      previousHash: '',
      hash: ''
    })];
  }

  public static getInstance(blockFactory: BlockFactory): Blockchain {
    if (!Blockchain.instance) {
      Blockchain.instance = new Blockchain(blockFactory);
    }
    return Blockchain.instance;
  }

  public async addBlock(data: BlockData): Promise<Block> { 
    await this.reloadChain();
    const newBlock = this.prepareNewBlock(data);
    await this.blockService.addBlock(newBlock);
    return this.getLastBlock();
  }
  
  private prepareNewBlock(data: BlockData): Partial<Block> {
    const lastBlock = this.chain[this.chain.length - 1];
    const newIndex = lastBlock.index + 1;
    const newTimestamp = new Date().toUTCString();
    const stringifiedData = JSON.stringify(data);
    const newHash = this.calculateHash(newIndex, newTimestamp, stringifiedData, lastBlock.hash);
  
    return { 
      index: newIndex, 
      timestamp: newTimestamp, 
      data: stringifiedData, 
      previousHash: lastBlock.hash, 
      hash: newHash 
    };
  }

  public async isChainValid(): Promise<boolean> {
    await this.reloadChain();
  
    for (let i = 1; i < this.chain.length; i++) {
      if (!this.isValidBlock(this.chain[i], this.chain[i - 1])) {
        return false;
      }
    }
  
    return true;
  }
  
  private isValidBlock(currentBlock: Block, precedingBlock: Block): boolean {
    const recalculatedHash = this.calculateHashForBlock(currentBlock); 
    if (currentBlock.hash !== recalculatedHash || currentBlock.previousHash !== precedingBlock.hash) {
      return false;
    }
  
    return true;
  }
  
  private calculateHashForBlock(block: Block): string {
    return this.calculateHash(block.index, block.timestamp, block.data, block.previousHash);
  }

  public async reloadChain(): Promise<void> {
    const count = await this.blockService.countBlocks();

    if(count === 1 || count !== this.chain.length)
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

   private calculateHash(
    index: number, 
    timestamp: string, 
    data: string, 
    previousHash: string
  ): string {
    const hash = crypto.createHash('sha256');
    const phrase = `${index}${timestamp}${data}${previousHash}`;
    hash.update(phrase);
    const result = hash.digest('hex');
    return result;
  }
  
}