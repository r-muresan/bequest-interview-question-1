import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

const hexHistory : { [key:string]: any } = [];
  //ordered history of hexes with changes logged
// const history : { [key:string]: any } = {}
  //use hex as key. Value = the original string data
//these are ideally stored somewhere else, like another database and/or user profile, and not the server. 
    // saved data will end when server reboots.


// utility functions - 
const sha256 = (data:string) => {
  const dataHash = crypto.createHash('sha256');
  dataHash.update(data)
  return dataHash.digest('hex');
} // makes hash 

// const verify = (data: string) => {
//   const sign = crypto.createSign('SHA256');
//   // return sign.write(data);
//   // console.log(sign);
// }

const storeHistory = async (data: any) => {
  const hex = await sha256(data.data).toString();
  const info = {
    hex,
    createdOn: new Date(),
    data
    // };
  }
  hexHistory.push(info);
}   //how do i make it so that changes to db ALWAYS mean new hex?
  //otherwise only legit ones have hexes and aren't recorded

storeHistory(database);


// Routes
app.get("/data", async (req, res) => {
  // const getHex = await sha256(database.data);
  // // console.log(hex)
  // console.log(getHex)
  await res.json(database);
});

app.get("/restore", async (req, res) => {

  await res.send(hexHistory);
})

app.patch("/verify", async (req, res) => {
  // console.log(req.body.data)
  const incoming = sha256(req.body.data);
  const current = sha256(database.data);
  await incoming === current ? res.json('true') : res.json('false');
  // console.log(sha256(database.data));
  // database.data = "compromise";
  // console.log(sha256(database.data))
  // database.data = "Hello World";
  // console.log(sha256(database.data))
}) 
  // what if data is returned for whatever reason?
    //how do i keep track of changes then?

app.post("/", (req, res) => {
  database.data = req.body.data;
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
