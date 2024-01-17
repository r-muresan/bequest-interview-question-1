import express, { Express } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import db from "./database/database";
import getEnvVar from "./getEnvVar";

db.connect();

export const app: Express = express();

app.use(express.json());
app.use(cors());

const server = app.listen(getEnvVar('PORT') || 8080, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});

// Routes

// app.get("/", (req, res) => {
//   res.json(database);
// });

// app.post("/", (req, res) => {
//   database.data = req.body.data;
//   res.sendStatus(200);
// });
