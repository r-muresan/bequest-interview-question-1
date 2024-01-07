import express from "express";
import cors from "cors";

const crypto = require('crypto-js');

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };


//Asset updation blueprint
interface Asset{
  value: string;
  updatedAt: Date;
}

//Template of Versioning history of the asset
class VersionHistory<Asset> {
  private history: Asset[] = [];

  push(data: Asset): void {
      this.history.push(data);
  }

  get(): Asset[] {
      return this.history;
  }

  getLatest(): Asset{
    return this.history[this.history.length - 1 ]
  }
}

//Maintaining the version history of changes of the assets
// Storing it in a database is recommended
const versionHistory = new VersionHistory<Asset>();


app.use(cors());
app.use(express.json());

//256-bit WEP key from randomkeygen.com
const SECRET_KEY = "23D3BE21776A33FB37DD4839778B9"
//This key is shared to the customer which will be used in the frontend
const CLIENT_KEY = "DEC7ECA8DA1ABDB239FE97F3766C5"


//function which involves encryption using AES algorithm
const encryptData = (data:string, key:string)=>{
  const ciphertext = crypto.AES.encrypt(data, key).toString();

  updateHistory(ciphertext)

}

//function which updates the changes of to the asset by the user 
const updateHistory = (data:string)=>{

  const stamp = {
    value : data,
    updatedAt : new Date()
  }

  versionHistory.push(stamp)

}
//function which involves in decrypting data using keys
const decryptData = (ciphertext:string, key:string) => {
  const bytes = crypto.AES.decrypt(ciphertext, key);
  const decryptedText = bytes.toString(crypto.enc.Utf8);
  return decryptedText;
}



// Routes

app.get("/", (req, res) => {
  const totalLength = versionHistory.get().length
  if(totalLength != 0 ){
    const asset = versionHistory.get()[totalLength - 1 ].value

    const response = {
      asset : asset,
      // asset:tamperDataSimulation(asset),
      data : database.data,
      secret : SECRET_KEY
    }

    res.setHeader('Content-Type', 'application/json');

    res.status(200).json(response);
  }else{
    res.status(200).json([]);
  }
});

app.post("/", (req, res) => {

  const key = req.body.key

//Validating the user with Client key
  if(key === CLIENT_KEY){
    database.data = req.body.data
    encryptData(req.body.data, SECRET_KEY+CLIENT_KEY)
    console.log(versionHistory.get())
  res.sendStatus(200);
  }
  else{
    res.sendStatus(401);
  }

});

//Simulating data tamper 
app.get("/tamper", (req, res) => {
  database.data = "Hello wor-- Tampered!!"
  res.sendStatus(200);
});

//Recovering the tampered data
app.get("/recover", (req, res) => {
  database.data = decryptData(versionHistory.getLatest().value,SECRET_KEY+CLIENT_KEY)
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  console.log("CLIENT_KEY = " + CLIENT_KEY)
  encryptData(database.data,SECRET_KEY+CLIENT_KEY)
  console.log("VERSION HISTORY : ")
  console.log(versionHistory.get())
});
