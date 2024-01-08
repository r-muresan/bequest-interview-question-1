import 'dotenv/config'
import express from "express";
import cors from "cors";
import generateHash from './utils/hashUtils';

var cron = require("node-cron");

const SECRET_KEY: string = process.env.SECRET_KEY || "";
const PORT = 8080;
const app = express();

interface DataInterface {
  data?: string;
  hash?: string;
}

let database: DataInterface = { data: "", hash: "" };
let databaseBackup: DataInterface = { ...database };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const data = req.body.data;
  const hash = generateHash(data, SECRET_KEY);

  database.data = data;
  database.hash = hash;

  res.sendStatus(200);
});

app.post("/verify", (req, res) => {
  const receivedData = req.body.data;

  const hash = generateHash(receivedData, SECRET_KEY);

  hash === database.hash
    ? res.status(200).json({ message: "Data integrity verified!" })
    : res.status(400).json({ error: "Data integrity verification failed" });
});

app.post("/recover", (req, res) => {
  database = { ...databaseBackup };
  res.status(200).json({ message: "Database recovered successfully" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// Currently CRON job is scheduled for every 5 seconds, but we can update it as per our requirements.
cron.schedule("*/5 * * * * *", () => {
  databaseBackup = { ...database };
});
