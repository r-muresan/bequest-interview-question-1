import db from "../../../database/database"
import { BlockRepository } from "./repositories/block.repository"
import { BlockService } from "./services/block.service"

export class BlockFactory {
  constructor(private readonly blockService: BlockService) {
      this.blockService = new BlockService(new BlockRepository(db.getSequelize()));
  }

  getBlockService(): BlockService {
    return this.blockService;
  }
  
}
