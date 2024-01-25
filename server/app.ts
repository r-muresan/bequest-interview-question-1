import express from "express";
import cors from "cors";
import { webcrypto } from 'crypto'

const PORT = 8080;
const app = express();


// This is just a convenient type for client keys.
// The keys received in this type should always be private RSA keys that are generated in the client.
type ClientKey = webcrypto.CryptoKey | null

// The key starts nil.
// The client should click the 'Create Key' button in the UI to generate a new rsa key pair before using the product.
// This will call the /keys end-point so we can store the public key in the server.
let clientPublicKey: ClientKey = null

// The database was enhanced with the rsa signature that was generated in the client last time the data was updated.
// The database will not be updated if the signature does not match, this is validated in the end-point that receives the data.
// If the data is tampered directly in the database, the client will know that this happened when the 'Verify Data' button is clicked,
// because the signature will no longer match the data. Even if the attacker is able to get full access to the server and
// also tampers the signature accordingly to an RSA digital signature that matches the new data, the client will still detect this
// as the 'Verify Data' action will re-sign using the newest data, but the previous private rsa key that was used to generate the
// previous signature in the database which will not match the new signature.
// The previous private key was never stored in the server so the attacker will never be able to generate a signature that matches it.
interface Database {
  data: string
  signature: string,
}

const database: Database = {
  data: '',
  signature: '',
};

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

// Here we validate that the newest data and signature matches the public key that is expected to be in the client.
const verifySignature = async (data: string, signature: string): Promise<boolean> => {
  const enc = new TextEncoder();
  const encodedData = enc.encode(data);
  var decodedSignature = Buffer.from(signature, 'base64');

  if (clientPublicKey == null) {
      throw new Error('Missing signing key')
  }

  return await webcrypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      clientPublicKey,
      decodedSignature,
      encodedData,
  );
}

// This just specifies the name of the header that will carry the digital signatures that will mitigate data tampering.
const SIGNATURE_HEADER_NAME = 'X-Bequest-Signature'

// This end-point updates the data in the server.
app.post("/", async (req, res) => {
  const data = req.body.data;

  // When new data is received this header should be filled with the digital signature of the data.
  const signature = req.get(SIGNATURE_HEADER_NAME)
  if (!signature) {
    // If no signature is received is received in the header, then the request is incorrect.
    res.sendStatus(400)
    return
  }

  try {
    // The signature received needs to match the client public key that is in the client.
    // That means the public received on the /keys end-point previously.
    const signatureMatches = await verifySignature(data, signature)
    if (!signatureMatches) {
      // Using forbidden access error to signal conflicting information for the client.
      // So that we can raise awareness that the data was tampered.
      res.sendStatus(409)
      return
    }

    database.data = data
    database.signature = signature
    res.sendStatus(200);
  } catch (err) {
    // The signature is probably invalid here.
    // Assuming that it is the only error scenario for the sake of time.
    // A more robust code would be required in real world to drill down the specific crypto verification errors.
    // We should have a different logic for OS / IO errors that are not expected returning 500 to signal things correctly to the client.
    res.sendStatus(400);
    return
  }
});

// Here we simply convert the jwk to a valid webcrypto key so we can make verify operations using this key.
const importPublicKey = async (jwk: object): Promise<webcrypto.CryptoKey> => {
  return await webcrypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      true,
      ["verify"],
  )
}

// This just specifies the name of the header that will carry the digital signature verification for enhancing the security.
const VERIFICATION_SIGNATURE_HEADER_NAME = 'X-Bequest-Verification-Signature'

// This end-point is expected to be called whenever we update the keys in the client.
app.post("/keys", async(req, res) => {
  const publicKeyJwk = req.body;
  if (!publicKeyJwk) {
    // If no public key is received in the body then the request is incorrect.
    res.sendStatus(400)
    return
  }

  try {
    const publicKey = await importPublicKey(publicKeyJwk)

    // If there was a previous public key, then verification is required.
    if (clientPublicKey != null) {

      // The client should fill the verification header with the digital signature for the end-point path '/keys' using
      // the latest private key. Ideally also for security we add the timestamp of when the signature was generated and
      // validate in the server this to be a reasonable timeframe from the current time (something like 15-30 seconds)
      // and also the payloads (in both the data update and the keys end-point), this would also help to mitigate against
      // replay attacks, this aspect is being simplified for now.
      const verificationSignature = req.get(VERIFICATION_SIGNATURE_HEADER_NAME)
      if (!verificationSignature) {
        // If no verification signature is received is received in the header, then the request is incorrect.
        res.sendStatus(400)
        return
      }

      const signatureMatches = await verifySignature('/keys', verificationSignature)
      if (!signatureMatches) {
        // Using forbidden access error to signal conflicting information for the client.
        // So that we can raise awareness that the data was tampered.
        res.sendStatus(409)
        return
      }
    }
    // Ideally here for security reasons we would require the client to digitally sign something with the previous private key
    // that pairs the current clientPublicKey before updating it.
    // It could be something as signing the string 'UPDATE-KEY' and here we would use verifySignature('/keys', signature)
    //       const await
    clientPublicKey = publicKey
    res.sendStatus(200);
  } catch (err) {
    // Key is probably invalid here.
    // Assuming that it is the only error scenario for the sake of time.
    // A more robust code would be required in real world to drill down the specific crypto importing errors.
    // We should have a different logic for OS / IO errors that are not expected returning 500 to signal things correctly to the client.
    res.sendStatus(400);
    return
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
