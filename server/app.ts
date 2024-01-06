import express from "express";
import cors from "cors";
import { checkDB, readDB, rollbackDB, updateDB } from "./db";

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.get("/", async (req, res) => {
  const result = await readDB();

  res.json({ data: result.data });
});

app.post("/", async (req, res) => {
  const data = req.body.data;
  const result = await updateDB(data);

  res.json({ data: result.data });
});

app.post("/verify", async (req, res) => {
  const data = req.body.data;
  const result = await checkDB(data);

  if (result) res.json({ data: true });
  else res.json({ data: false });
});

app.put("/rollback", async (req, res) => {
  const result = await rollbackDB();

  res.json({ data: result.data });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
