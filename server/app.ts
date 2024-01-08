import express from "express";
import cors from "cors";

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const PORT = 8080;
const app = express();
const database = { data: "Hello World", hash: "", changeLog: [] };

database.hash = bcrypt.hashSync(database.data, saltRounds); // initialize hash on startup

// Uncomment the following to simulate unauthorized data change 
// database.data = "Hello My World";

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  database.hash = req.body.hash;
  database.changeLog = req.body.changeLog;
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
