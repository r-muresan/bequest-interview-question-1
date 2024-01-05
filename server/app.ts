import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const database = { data: "Hello World", hash: "" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(data: database.data, hash: database.hash);
});

app.post("/", (req, res) => {
  const currentData = req.body.data;
  const currentHash = dataHash(currentData);

  if (currentHash === req.body.hash) {
    database.data = currentData;
    database.hash = currentHash;
    res.sendStatus(200);
  } else {
    res.status(400).send("Integrity check failed")
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

const dataHash = (data) => {
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return hash;
};
