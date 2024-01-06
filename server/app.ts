import express from "express";
import cors from "cors";
import * as CryptoJS from 'crypto-js'
import { timingSafeEqual } from 'crypto';

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };


const backup_database = { data: ""};
const secret_database = {hmac: "", secretKey: "", iv: ""} // Store crypto info in a secret database
const {secretKey, iv} = generateRandomKeyAndIV();
secret_database.secretKey = secretKey;
secret_database.iv = iv;
let backupSwitch = true; // A flag used to guide the backup


app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  logWithTimestamp("Server status: reading database...");
  res.json({data: readDB()});
});

// Route to allow users to recover their own data.
app.get("/recover", (req, res) => {
  logWithTimestamp("Server status: recovering database...");
  recoverDB();
  res.sendStatus(200);
});

// Route to allow users to check if data has been tampered with.
app.get("/verify", (req, res) => {
  logWithTimestamp("Server status: verifying database...");
  if(checkDB()){
    res.json({data:"Data verified successfully"});
  }
  else{
    res.json({data:"Database breached"});
  }
});

// Route to allow users to write data to database.
app.post("/", (req, res) => {
  logWithTimestamp("Server status: writing to database...");
  writeDB(req.body.data);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  logWithTimestamp("Server running on port " + PORT);

  /*
  Back up the database periodically(every 15 seconds)
  */
  setInterval(() => {
    if(checkDB() && backupSwitch){
      /*
      Only backup database when data has not been tampered
      */
      logWithTimestamp("Server status: regular database backup...");
      backupDB();
    }
  }, 15000); 

  /*
  A simulation for database breach(every 60 seconds)
  */
  setInterval(() => {
    logWithTimestamp("Server status: DATA BREACH SIMULATION!!!");
    breachSimulation();
  }, 30000);
});

/**
 * Simulation function for data breach
 */
function breachSimulation() {
  database.data = Math.random().toString(36).substring(64);
}

/**
 * Encrypt the input data with AES and calculate its hmac for
 * verification. Store the encrypted data in database and backup
 * the current database.
 * @param inputData 
 */
function writeDB(inputData: string): void {
  const encryptedText = encryptText(inputData);
  database.data = encryptedText;
  secret_database.hmac = generateHMAC(encryptedText, secret_database.secretKey);
  backupDB();
}

/**
 * Read data from the database, decrypt it and check if it has been
 * tampered. If tampered, return warning message, else return the 
 * decrypted data.
 * @returns string
 */
function readDB(): string {
  if(checkDB()){
    return decryptText(database.data)
  }
  else{
    return "Database breached!"
  }
}

/**
 * Backup the database
 */
function backupDB(): void{
  backup_database.data = database.data
}

/**
 * Recover the database from the backup database
 */
function recoverDB(): void{
  database.data = backup_database.data
  backupSwitch = true // Turn the switch back since now the database is recovered
}

/**
 * Check if database is breached and modify the backup switch accordingly.
 * @returns boolean
 */
function checkDB(): boolean {
  logWithTimestamp("Server status: checking data integrity...")
  const calculatedHMAC = generateHMAC(database.data, secret_database.secretKey);

  if(secret_database.hmac == ""){
    return true;
  }
  
  if(timingSafeEqual(Buffer.from(calculatedHMAC, 'hex'), Buffer.from(secret_database.hmac, 'hex'))){
    backupSwitch = true;
    return true;
  }
  else{
    backupSwitch = false;
    return false;
  }
}

/**
 * Generate hmac for encrypted message.
 * @param data 
 * @param key 
 * @returns hmac string
 */
function generateHMAC(data: string, key: string): string {
  const hmac = CryptoJS.HmacSHA256(data, key);
  return hmac.toString(CryptoJS.enc.Hex);
}

/**
 * Generate secret key and initialization vector.
 * @returns 
 */
function generateRandomKeyAndIV(): { secretKey: string, iv: string } {
  const secretKey = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex); 
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex); 
  return { secretKey, iv };
}

/**
 * Encrypt the data using AES algo.
 * @param text 
 * @returns 
 */
function encryptText(text: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, secret_database.secretKey, { iv: CryptoJS.enc.Hex.parse(secret_database.iv) });
  return encrypted.toString();
}

/**
 * Decrypt the data.
 * @param ciphertext 
 * @returns 
 */
function decryptText(ciphertext: string): string {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, secret_database.secretKey, { iv: CryptoJS.enc.Hex.parse(secret_database.iv) });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Helper function to generate server log with timestamps
 * @param message 
 */
function logWithTimestamp(message: string) {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] ${message}`);
}
