import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();

// Secret key( You must chanage this before implementation )
const secretKey: string = 'secret_key';

function hashData(data: string, secretKey: string): string {
  return crypto.createHash("sha256").update(`${data}${secretKey}`).digest("hex");
}

const database = { data: "Hello World", hash: hashData("Hello World", secretKey) };
const backupDatabase = { ...database };

app.use(cors());
app.use(express.json());


// Routes

app.get("/", (req, res) => {
  res.json({ data: database.data });
});

app.post("/", (req, res) => {
  const data = req.body.data;
  const hashed = hashData(data, secretKey);
  database.data = data;
  database.hash = hashed;

  backupDatabase.data = data;
  backupDatabase.hash = hashed;

  res.sendStatus(200);
});

app.get("/verify-data", (req, res) => {
  const data = database.data;
  const hashed = hashData(data, secretKey);
  res.json({ verified: hashed === database.hash });
});

app.get("/recover-data", (req, res) => {
  database.data = backupDatabase.data;
  database.hash = backupDatabase.hash;
  res.json({ data: database.data });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
