import express from "express";
import cors from "cors";
import { signData, verifySignature } from "./cryptography";

interface BackupDatabase {
  data: string,
  signature: string
}

const PORT = 8080;
const app = express();

const backupDatabase: BackupDatabase[] = []
const database = { data: "Hello World", signature: '' };

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  let signature = signData(database.data)
  let data = database.data

  if(!database.signature) database.signature = signature

  if (Math.random() < 0.2) {
    signature = 'tampered'
    data = database.data + ' - tampered'
  }

  res.json({
    data,
    signature
  });
});

app.post("/", (req, res) => {
  const data = req.body.data;
  const signature = req.body.signature;

  const isSignatureValid = verifySignature(data, signature);

  if (isSignatureValid) {
    addBackupData(database.data, signature)

    database.data = data;
    database.signature = signature

    res.sendStatus(200);
  } else {
    console.error('Data tampered!');
    res.status(400).send('Data tampered');
  }
});

app.get('/recover', (req, res) => {
  let data = database.data;
  let signature = database.signature;

  if (Math.random() < 0.4) {
    signature += 'tampered'
    data = database.data + ' - tampered in database'
  }

  const isSignatureValid = verifySignature(data, signature);

  if (isSignatureValid) {
    res.json({
      data: database.data,
      signature
    });
  } else {
    console.error('Data in database has been tampered!');
    
    resetDatabase()

    res.json({
      data: data,
      signature: signature
    });
  }
})

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

function resetDatabase(){
  const backUpItem = backupDatabase.pop()

  database.data = backUpItem!.data
  database.signature = backUpItem!.signature
}

function addBackupData(oldData: string, oldSignature: string) {
  backupDatabase.push({
    data: oldData,
    signature: oldSignature
  })
};