import {
  ACCESS_SECRECT_KEY,
  REFRESH_SECRECT_KEY,
} from "../../server/middleware/auth.ts";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import express from "express";
const router = express.Router();

// Route to accept resfresh token and offer a new accesstoken to client
router.route("/refresh").get((req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    REFRESH_SECRECT_KEY,
    (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid token" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: req.body.username,
          },
        },
        ACCESS_SECRECT_KEY,
        { expiresIn: "10m" }
      );

      res.json({ accessToken });
    }
  );
});

router.route("/login").post((req, res) => {
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: req.body.username,
      },
    },
    ACCESS_SECRECT_KEY,
    { expiresIn: "10m" }
  );

  const refreshToken = jwt.sign(
    { username: req.body.username },
    REFRESH_SECRECT_KEY,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
});

router.route("/logout").post((req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none" });
  res.json({ message: "Cookie cleared" });
});

export default router;
