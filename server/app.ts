import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const generateHash = (data: string) => {
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return hash;
}
const database = { data: "Hello World", hash: generateHash("Hello World") };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const newData = req.body.data;
  const newHash = req.body.hash;

  if (newHash === generateHash(newData)){
    database.data = newData;
    database.hash = generateHash(newData)
    res.sendStatus(200);
    return
  };
  
  res.sendStatus(400);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
