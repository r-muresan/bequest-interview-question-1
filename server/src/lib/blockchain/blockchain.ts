import Block from "./block";

class Blockchain {
  private blocks: Block[] = [new Block()];
  private nextIndex: number = 1;
  static singleton: Blockchain;

  getTheLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  addBlock(data: string) {
    const block = new Block(
      this.nextIndex++,
      this.getTheLatestBlock().hash,
      data
    );
    this.blocks.push(block);
    return block;
  }

  validateChainIntegrity() {
    for (let index = this.blocks.length; index > 0; index--) {
      const currentBlock = this.blocks[index];
      const previousBlock = this.blocks[index - 1];

      if (
        currentBlock.hash !== currentBlock.generateHash() ||
        currentBlock.previousHash !== previousBlock.hash ||
        currentBlock.index !== previousBlock.index + 1
      ) {
        return false;
      }
    }
    return true;
  }

  static getInstance() {
    if (!Blockchain.singleton) {
      Blockchain.singleton = new Blockchain();
    }
    return Blockchain.singleton;
  }
}

export default Blockchain.getInstance();
