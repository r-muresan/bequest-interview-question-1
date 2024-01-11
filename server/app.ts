import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

const hexHistory : { [key:string]: any } = [];
  //ordered history of hexes with timestamps logged
//these are ideally stored somewhere else, like another database and/or user profile, and not the server. 

// utility functions - 
const sha256 = (data:string) => {
  const dataHash = crypto.createHash('sha256');
  dataHash.update(data)
  return dataHash.digest('hex');
} // makes hash 

const storeHistory = async (data: any) => {
  const hex = await sha256(data.data).toString();
  const info = {
    hex,
    createdOn: new Date(),
    name: data.data
  }

  hexHistory.push(info);
}   //how do i make it so that changes to db ALWAYS mean new hex?
  //otherwise only legit ones have hexes and aren't recorded

storeHistory(database);

// Routes
app.get("/", async (req, res) => {
  await res.json(database);
});

app.get("/restore", async (req, res) => {
  await res.send(hexHistory);
})

app.patch("/verify", async (req, res) => {
  const incoming = sha256(req.body.data);
  const current = sha256(database.data);
  await incoming === current ? res.json('true') : res.json('false');
}) 

app.patch("/", async (req, res) => {
  database.data = req.body.data;
  storeHistory(database);
  res.sendStatus(200);
}) 

app.post("/:data", (req, res) => {
  console.log(database.data);
  database.data = req.params.data
  storeHistory(database);
  console.log(database.data);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
