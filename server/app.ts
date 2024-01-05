import express from "express";
import cors from "cors";
import crypto from "crypto";
const PORT = 8080;
const app = express();
const database = { data: "Hello World",hash:createHash("Hello World")};

app.use(cors());
app.use(express.json());
function createHash(data: string) {
  return crypto.createHash("sha256").update(data).digest("hex");
}
// The client can recover data by refreshing the data from the server as the server will always contain
// the latest data. The client can verify the integrity of the data by comparing the hash of the data

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const newData = req.body.data;
  if(newData!=database.data){
    database.data = newData;
    console.log("Data changed to: " + newData);
    database.hash = createHash(newData);
  }
  res.sendStatus(200);
});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
