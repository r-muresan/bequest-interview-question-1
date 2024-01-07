import express from "express";
import cors from "cors";
import CryptoJS from "crypto-js";

const PORT = 8080;
const app = express();
const database = { data: "", hashedData: "" };

app.use(cors());
app.use(express.json());

const createHashAndStore = (stringToHash: string) => {
  const hashedString = CryptoJS.SHA256(stringToHash).toString();
  database.hashedData = hashedString;
  return hashedString;
};

const createHashToVerify = async (stringToHash: string) => {
  const hashedString = CryptoJS.SHA256(stringToHash).toString();
  return hashedString;
};

const createBackup = () => {
  const fs = require("fs");

  const jsonData = JSON.stringify(database);
  fs.writeFileSync("backup.json", jsonData);

  console.log("Backup successful");
};

const restoreFromBackup = () => {
  const fs = require("fs");
  const backupData = fs.readFileSync("backup.json", "utf-8");
  const restoredData = JSON.parse(backupData);
  console.log("Restored the backup");
};

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/update", (req, res) => {
  database.data = req.body.data;
  createHashAndStore(database.data);
  createBackup();
  res.sendStatus(200);
});

app.post("/verify", async (req, res) => {
  const receivedData = req.body.data;
  const hashedString = await createHashToVerify(receivedData);
  const isMatch = hashedString === database.hashedData;
  res.send(isMatch);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
