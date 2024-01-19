import db from "../../../database/database"
import { Blockchain } from "./blockchain";
import { BlockchainController } from "./controllers/blockchain.controller";
import { BlockFactory } from "../block/block.factory";
import { BlockService } from "../block/services/block.service";
import { BlockRepository } from "../block/repositories/block.repository";

function BlockchainFactory() {
  const blockService = new BlockService(new BlockRepository(db.getSequelize()));
  const blockFactory = new BlockFactory(blockService);
  const blockchain = new Blockchain(blockFactory);
  const blockchainController = new BlockchainController(blockchain);
  return {blockchain, blockchainController};
}


export const { blockchain, blockchainController } = BlockchainFactory()