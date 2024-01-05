import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();

interface HistoryEntry {
  data: string;
  timestamp: string;
}

const database: { data: string; history: HistoryEntry[] } = {
  data: "Hello World",
  history: [],
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ data: database.data });
});

app.post("/", (req, res) => {
  database.history.push({ data: database.data, timestamp: new Date().toISOString() });
  database.data = req.body.data;
  res.sendStatus(200);
});

app.get("/history", (req, res) => {
  res.json(database.history);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
