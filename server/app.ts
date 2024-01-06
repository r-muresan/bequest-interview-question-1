import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
let database = {
  data: "Hello World",
  hash: calculateHash("Hello World"), // Store the hash along with data
};

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const { data, hash } = req.body;

  // Verify if the hash matches the current data
  if (hash === calculateHash(database.data)) {
    // Update the database
    database = {
      data,
      hash: calculateHash(data),
    };

    res.sendStatus(200);
  } else {
    res.status(400).send("Data tampered! Cannot update.");
  }
});

app.post("/verify", (req, res) => {
  const { data, hash } = req.body;

  // Verify if the hash matches the current data
  const isVerified = hash === calculateHash(database.data);

  if (isVerified) {
    res.status(200).send("Data is valid.");
  } else {
    res.status(400).send("Data tampered!");
  }
});

app.post("/recover", (req, res) => {
  const { backup } = req.body;

  // Restore the database from the backup
  database = { ...backup };

  res.status(200).send("Data recovered successfully.");
});

function calculateHash(data: string) {
  // Calculate hash of the data
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return hash;
}

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
