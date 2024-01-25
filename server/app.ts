import express from "express";
import cors from "cors";

import { generateHash } from './helpers/security';

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors({
  exposedHeaders: 'X-Bequest-Hash'
}));
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.set("X-Bequest-Hash", generateHash(database));
  res.json(database);
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  res.set("X-Bequest-Hash", generateHash(database));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
