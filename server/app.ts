import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();
const crypto = require("crypto");

const startData = "Hello World";
const startHash = crypto
  .createHash("sha256")
  .update(JSON.stringify(startData))
  .digest("hex");

type dataVersionsType = {
  [key: string]: {
    data: string,
    hash: string,
  }
};

const database = { data: "Hello World", hash: startHash };
const dataVersions: dataVersionsType = {}; // e.g. "timestamp": { data, hash };

// stores a version of the current database with a timestamp
const storeDataVersion = () => {
  const timestamp = new Date().toISOString();
  dataVersions[timestamp] = { ...database };
  console.log("data version dict: ", dataVersions);
};

// restores the database to a selected version
const restoreDataVersion = (timestamp: string) => {
  const versionToRestore = dataVersions[timestamp];
  if (versionToRestore) {
    database.data = versionToRestore.data;
    database.hash = versionToRestore.hash;
  }
};

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  try {
    res.json(database);
  } catch(error) {
    console.error("Error getting database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/backup-data", (req, res) => {
  try {
    res.json(dataVersions);
  } catch(error) {
    console.error("Error getting backup data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/verify-data", async (req, res) => {
  try {
    const { data, hash } = database;

    // re compute hash
    const computedHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");

    // true if data is intact, false otherwise
    res.json({ verified: computedHash === hash });
  } catch (error) {
    console.error("Error checking data integrity:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", (req, res) => {
  const { data, hash } = req.body;

  // compute hash of received data
  const computedHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

  // compare computed and received hash to see if data is intact
  if (computedHash === hash) {
    try {
      database.data = data;
      database.hash = hash;
      storeDataVersion();
      res.sendStatus(200);
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    // data was tampered with
    res.status(400).send("Data integrity check failed");
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
