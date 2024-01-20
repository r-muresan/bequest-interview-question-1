import db from "../../../database/database"
import { BlockRepository } from "./repositories/block.repository"
import { BlockService } from "./services/block.service"

export function BlockFactory() {
  const blockService = new BlockService(new BlockRepository(db.getSequelize()));

  return {blockService};
}

export const { blockService } = BlockFactory()