import express from "express";
import cors from "cors";
import CryptoJS from "crypto-js";

const PORT = 8080;
const app = express();
let database = { data: "", hashedData: "" };

app.use(cors());
app.use(express.json());

// Function responsible for creating a SHA-256 hash of the database and store it for verification further
const createHashAndStore = (stringToHash: string) => {
  const hashedString = CryptoJS.SHA256(stringToHash).toString();
  database.hashedData = hashedString;
  return hashedString;
};

// Function responsible to verify if the entered or passed value from the client is same as that was entered.
// The attacked wont be able to modify the hash here
const createHashToVerify = async (stringToHash: string) => {
  const hashedString = CryptoJS.SHA256(stringToHash).toString();
  return hashedString;
};

// after every update this function is responsible to create a backup file with the entered data present in the database
const createBackup = () => {
  const fs = require("fs");
  const jsonData = JSON.stringify(database.hashedData);
  fs.writeFileSync("backup.json", jsonData);
};

// if the user requests a restore from the backup, this function is responsible to do so. The file is store in the
// source folder itself
const restoreFromBackup = () => {
  const fs = require("fs");
  const backupData = fs.readFileSync("backup.json", "utf-8");
  const restoredData = JSON.parse(backupData);
  database = restoredData
  console.log("Restored the backup ");
};


// Routes

app.get("/", (req, res) => {
  res.json(database);
});

// update the values in database and create hashes and backups
app.post("/update", (req, res) => {
  database.data = req.body.data;
  createHashAndStore(database.data);
  createBackup();
  res.sendStatus(200);
});

// verify if the entered value is same as that which is stored
app.post("/verify", async (req, res) => {
  const receivedData = req.body.data;
  const hashedString = await createHashToVerify(receivedData);
  const isMatch = hashedString === database.hashedData;
  res.send(isMatch);
});

// if the user wants to restore to the previous backup
app.post("/restore", async (req, res) => {
  restoreFromBackup();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
