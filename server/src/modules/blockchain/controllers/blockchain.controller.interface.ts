import { NextFunction, Request, Response } from "express";
import Block from "../../block/models/block.model";

export interface IBlockController {
  addBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
  getLastBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
  isChainValid(req: Request, res: Response, next: NextFunction): Promise<void>;
  getChain(req: Request, res: Response, next: NextFunction): Promise<void>;
}