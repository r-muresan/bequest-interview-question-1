import { Request, Response } from "express";
import Blockchain from "../../lib/blockchain/blockchain";
import { postDataRequestSchema } from "./dto/post-data-request";
import { validateChecksum } from "../../lib/helper/crypto";

export const getData = (_: Request, res: Response) => {
  const block = Blockchain.getTheLatestBlock();
  res.json(block);
};

export const postData = (req: Request, res: Response) => {
  try {
    const body = postDataRequestSchema.parse(req.body);

    if (!validateChecksum(body.data, body.checksum)) {
      throw new Error("Invalid checksum");
    }

    const block = Blockchain.addBlock(body.data);

    return res.json(block);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
