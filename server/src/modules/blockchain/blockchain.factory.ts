import db from "../../../database/database"
import { Blockchain } from "./blockchain";
import { BlockchainController } from "./controllers/blockchain.controller";
import { blockService } from "../block/block.factory";
import { BlockService } from "../block/services/block.service";
import { BlockRepository } from "../block/repositories/block.repository";

function BlockchainFactory() {
  const blockchain = Blockchain.getInstance(blockService);
  const blockchainController = new BlockchainController(blockchain);
  return {blockchain, blockchainController};
}


export const { blockchain, blockchainController } = BlockchainFactory()