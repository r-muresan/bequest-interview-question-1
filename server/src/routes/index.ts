import { Express } from "express";
import { getData, postData } from "./data/controller";

export default function Route(app: Express) {
  app.get("/", getData);
  app.post("/", postData);
}
