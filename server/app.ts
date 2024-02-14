import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import {
  findOrCreateUser,
  getChangesUserNames,
  getUser,
  updateUser,
} from "./controllers/user";
import { authMiddleware } from "./lib/middlewares/authMiddleware";

import { schemaBody } from "./lib/middlewares/schemaMiddleware";
import { authSchema, updateUserSchema } from "./lib/schemas";

const PORT = 8080;
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

interface IRequest extends Request {
  [user: string]: any;
}

// Routes
app.use((req: IRequest, res: Response, next: NextFunction) => {
  req.user;
  next();
});

app.post(
  "/login",
  schemaBody(authSchema),
  async (req: Request, res: Response) => {
    try {
      const { name, password } = req.body;
      const response = await findOrCreateUser(name, password);
      res.send(response);
    } catch (error: any) {
      if (error.message == "Incorrect password")
        res.status(401).send({ message: error.message });
      else res.status(500).send({ message: error.message });
    }
  }
);

app.get("/user", authMiddleware, async (req: IRequest, res: Response) => {
  try {
    const { user } = req.user;
    const response = await getUser(user.userId);
    res.send(response);
  } catch (error: any) {
    if (error.message == "User not found")
      res.status(404).send({ message: error.message });
    else res.status(500).send({ message: error.message });
  }
});

app.patch(
  "/update",
  schemaBody(updateUserSchema),
  authMiddleware,
  async (req: IRequest, res: Response) => {
    try {
      const { name } = req.body;
      const { user } = req.user;
      const response = await updateUser(name, user);
      res.send(response);
    } catch (error: any) {
      if (error.message == "The 'name' field cannot be empty")
        res.status(400).send({ message: error.value });
      if (error.message == "User not found")
        res.status(400).send({ message: error.value });
      else
        res
          .status(500)
          .send({ message: "Internal Server Error", error: error.message });
    }
  }
);

app.get(
  "/get-changes-usernames",
  authMiddleware,
  async (req: IRequest, res: Response) => {
    const { user } = req.user;
    const response = await getChangesUserNames(user);
    res.send(response);
  }
);
app.post("save-changes-user", (req: IRequest, res: Response) => {
  res.send("data stored in another database");
});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
