import { IBlockController } from "./blockchain.controller.interface";
import { Blockchain } from "../blockchain";
import { NextFunction, Request, Response } from "express"
import { STATUS_CODE } from "../../../utils/status.codes";

export class BlockchainController implements IBlockController {

  constructor(private blockchain: Blockchain) {
  }

  addBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body }: { body: any } = req;
      // TODO: dto to validade body
      if(body && body?.data){
        console.log(body.data);
        const response = await this.blockchain.addBlock(body);
        res.status(STATUS_CODE.OK).send(response)
      }
    } catch (error) {
      next(error);
    }
  };

  getLastBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.blockchain.getLastBlock();
      res.status(STATUS_CODE.OK).send(response);
    } catch (error) {
      next(error);
    }
  };

  isChainValid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.blockchain.isChainValid();
      res.status(STATUS_CODE.OK).send(response);
    } catch (error) {
      next(error);
    }
  };

  getChain = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.blockchain.getChain();
      res.status(STATUS_CODE.OK).send(response);
    } catch (error) {
      next(error);
    }
  };

  recoverChain = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.blockchain.recoverChain();
      res.status(STATUS_CODE.OK).send(response);
    } catch (error) {
      next(error);
    }
  };
}