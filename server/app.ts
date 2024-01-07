import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  console.log("database", database)
  res.json(database);
});

app.post("/", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  res.charset = "utf-8";
  database.data = req.body.hashedData;
  console.log("received", database)
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
