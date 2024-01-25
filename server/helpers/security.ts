import { HmacSHA512 } from "crypto-js";
import { config } from "../config";

export const generateHash = (body: object): string => {
  const msg = JSON.stringify({ body })
  return HmacSHA512(msg, config.salt).toString();
}

