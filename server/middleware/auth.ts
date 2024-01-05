import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const ACCESS_SECRECT_KEY = "606b1a493ec14c77bd702a54b28c8b1f";
export const REFRESH_SECRECT_KEY = "e1c0a72f71524626a12d3f0a4bc998f3";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader =
    req.headers.authorization || (req.headers.Authorization as string);
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    ACCESS_SECRECT_KEY,
    (err: VerifyErrors | null, decoded:any) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.body.username = decoded?.UserInfo.username;
      next();
    }
  );
};
