import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

const hexHistory: string[] = [];
  //ordered history of hexes with changes logged
const history : { [key:string]: any } = {}
  //use hex as key. Value = the original string data
//these are ideally stored somewhere else, like another database user profile, and not the server.


// utility functions - 
const sha256 = async (data:string) => {
  const dataHash= crypto.createHash('sha256');
  dataHash.update(data).digest('hex');
  return dataHash;
} // makes hash 


const storeHistory = async (data: any) => {
  const hex = await sha256(data.data).toString();
  if (hexHistory.indexOf(hex) > -1) {
    
  } else { //did not have data => stores it
    hexHistory.push(hex);
    history[hex]  = {
      createdOn: new Date(),
      data
    };
  }
  //how do i make it so that changes to db ALWAYS mean new hex?
  //otherwise only legit ones have hexes and aren't recorded
    //and it would be easy to fake a hex anyway...
} 


// Routes

app.get("/", (req, res) => {
  
  const getHex = sha256(database.data);
  // console.log(hex)
  console.log(getHex)
  // res.json(hex);

});


app.patch("/", (req, res) => {
  database.data = "compromise";
})

app.post("/", (req, res) => {
  database.data = req.body.data;
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
