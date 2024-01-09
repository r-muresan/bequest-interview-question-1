import express from "express";
import cors from "cors";

// @ts-ignore
import sha256 from "crypto-js/sha256";
// @ts-ignore
import encHex from "crypto-js/enc-hex";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  const hash = sha256(database.data).toString(encHex);
  res.json({ data: database.data, hash });
});

app.post("/", (req, res) => {
  // database.data = req.body.data;
  // res.sendStatus(200);
  const newData = req.body.data;
  const hash = sha256(newData).toString(encHex);

  if (hash === req.body.hash) {
    database.data = newData;
    res.sendStatus(200);
  } else {
    res.status(400).send("Data integrity verification failed");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
