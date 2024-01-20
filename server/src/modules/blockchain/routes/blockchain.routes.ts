import express from "express";
import { blockchainController } from "../blockchain.factory";

const blockchainRoutes = express.Router();

blockchainRoutes.post("/", blockchainController.addBlock);
blockchainRoutes.get("/last", blockchainController.getLastBlock);
blockchainRoutes.get("/validate", blockchainController.isChainValid);
blockchainRoutes.get("/recover", blockchainController.recoverChain);
blockchainRoutes.get("/chain", blockchainController.getChain);

export default blockchainRoutes;