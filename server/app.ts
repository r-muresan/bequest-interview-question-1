import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();

type DataProps = {
  data?: string;
  hash?: string;
};
let database: DataProps = { data: "Hello World" };
let databaseBackup: DataProps = {};

app.use(cors());
app.use(express.json());

// Hashing function
function createHash(data: string) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const data = req.body.data;

  // need to backup data before update data.
  databaseBackup = database;

  database.data = data;
  database.hash = createHash(data);

  res.sendStatus(200);
});

// Endpoint to verify data
app.post("/verify", (req, res) => {
  const currentHash = createHash(req.body.data);
  if (currentHash === database.hash) {
    res.json({ isVerified: true });
  } else {
    res.json({ isVerified: false });
  }
});

// Endpoint to recover data
app.get("/recover", (req, res) => {
  database.data = databaseBackup.data;
  res.json(database);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
