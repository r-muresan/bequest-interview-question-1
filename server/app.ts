import express from "express";
import cors from "cors";
import crypto from "crypto";

interface dataObj {
  data: string;
  hash: string;
}

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };
// A backup of the database values. Here using an array to record multiple changes.
const dataHistory: Array<dataObj> = [
  {
    data: database.data,
    hash: crypto.createHash("sha256").update(database.data).digest("hex"),
  },
];

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  const computedHash = crypto
    .createHash("sha256")
    .update(database.data)
    .digest("hex");
  res.json({ data: database.data, hash: computedHash });
});

app.post("/", (req, res) => {
  const receivedData = req.body.data;
  const receivedHash = req.body.hash;

  // Validate data integrity
  const computedHash = crypto
    .createHash("sha256")
    .update(receivedData)
    .digest("hex");
  if (computedHash === receivedHash) {
    // Save to data history
    dataHistory.push({
      data: database.data,
      hash: computedHash,
    });

    // Update current data
    database.data = receivedData;
    res.sendStatus(200);
  } else {
    res.status(400).send("Data integrity check failed");
  }
});

// History route
app.get("/history", (req, res) => {
  res.json(dataHistory);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
