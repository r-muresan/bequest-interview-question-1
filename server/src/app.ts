import express, { Express } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AddressInfo } from "net";
import db from "../database/database";
import { startAllCronJobs } from "./modules/cronjobs/cronjobs.manager";

dotenv.config();
db.connect();

export const app: Express = express();

app.use(express.json());
app.use(cors());

startAllCronJobs();

export const server = app.listen(process.env.PORT || 3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});