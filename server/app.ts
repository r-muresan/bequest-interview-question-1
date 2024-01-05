import 'dotenv/config'
import express from "express";
import cors from "cors";
import { generateHash } from "./hash-utils";

interface IData {
  data?: string;
  hash?: string;
}

const PORT = 8080;
const app = express();
const HASH_SECRET_KEY: string = process.env.HASH_SECRET_KEY || '';
const database: IData = { data: "Hello World", hash: generateHash("Hello World", HASH_SECRET_KEY) };

// We need to use cloud storage such as S3 from AWS to store backup data. To make everything simple, just use local variable. 
// When we backup the data into storage, we need to check whether the data is tampered with or not. If it's tampered with, 
// we can send an alert to user and do not store into backup storage. 
const backupData: IData = { ...database };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const data: string = req.body.data;
  database.data = data;
  database.hash = generateHash(data, HASH_SECRET_KEY);
  
  // instead of doing this every update, we can have a scheduled job to backup data.
  backupData.data = database.data;
  backupData.hash = database.hash;
  res.sendStatus(200);
});

app.post("/verify", (req, res) => {
  const data: string = database.data || '';
  const hash: string = generateHash(data, HASH_SECRET_KEY);
  res.json({ verified: hash === database.hash });
});

app.post("/recover", (req, res) => {
  database.data = backupData.data;
  database.hash = backupData.hash;
  res.json(database);
});

/**
 * POST /tamper
 * 
 * This is the endpoint for only test purpose. From frontend, will call this endpoint to tamper database data.
 * After this endpoint is called, we can verify if the data is tampered with correctly. 
 */
app.post("/tamper", (req, res) => {
  const data: string = req.body.data;
  database.data = data;
  database.hash = generateHash(data, '');
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
