import express, { response } from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

let key = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "der" },
  privateKeyEncoding: { type: "pkcs8", format: "der" },
});
let publicKey = key.publicKey.toString("base64");
let privateKey = key.privateKey.toString("base64");
let lastCheckpoint = { data: "" };

const createSignature = (data: any) => {
  let privateKey_ = crypto.createPrivateKey({
    key: Buffer.from(privateKey, "base64"),
    type: "pkcs8",
    format: "der",
  });
  const sign = crypto.createSign("sha256");
  sign.update(data);
  sign.end();
  const signature = sign.sign(privateKey_).toString("base64");
  return signature;
};

// Routes
app.get("/", (req, res) => {
  res.json({ data: database.data, publicKey });
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  lastCheckpoint = { data: database.data };
  let sign = createSignature(database.data);
  res.json({ sign });
});

// endpoint to verify digital signature
app.post("/verifySignature", (req, res) => {
  let { data, publicKey, signature } = req.body;
  publicKey = crypto.createPublicKey({
    key: Buffer.from(publicKey, "base64"),
    type: "spki",
    format: "der",
  });
  const verify = crypto.createVerify("sha256");
  verify.update(data);
  verify.end();
  let result = verify.verify(publicKey, Buffer.from(signature, "base64"));
  res.send(result);
});

// endpoint to recover data after it is tampered
app.get("/recover", (req, res) => {
  res.json({ data: lastCheckpoint.data });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
