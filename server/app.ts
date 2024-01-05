import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

const sha256 = (data:string) => {
  const dataHash= crypto.createHash('sha256');
  dataHash.update(data);
  return dataHash.digest('hex');
}

const hex = sha256(database.data);
  //cryptographic hash


// Routes

app.get("/", (req, res) => {
  const hex = sha256(database.data);
  console.log(hex)
  res.json(hex);

});

app.get("/compromise", (req, res) => {
  console.log(database);
  database.data = "compromised";
  console.log(database);

  const hex = sha256(database.data);
  console.log(hex)
  res.json(hex);
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
