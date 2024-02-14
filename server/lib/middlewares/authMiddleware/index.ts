import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const secret = "thisissecretkey";
// This secret it will put in file '.env' but this is only example for exam don't use 'process.env.SECRET'

export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const requestAuth = req.headers.authorization;
    if (!requestAuth) res.status(401).send({ message: "Token not found" });
    const token = requestAuth.split(" ")[1];
    try {
      const tokenVerified: any = jwt.verify(token, secret);

      req.user = tokenVerified;
      next();
    } catch (error) {
      return res.status(400).send({ message: "Invalid token" });
    }
  } catch (error) {
    return next(error);
  }
};
