// src/routes/dataRoutes.ts

import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { users, backupUsers } from "../models/userModel";
import { createSign, createVerify } from "crypto";

const router = express.Router();

// POST to add user data and backup
router.post("/", authenticateToken, (req, res) => {
  const { username } = (req as any).user;
  const { data } = req.body;
  // Sign the data with the user's private key
  const signer = createSign("SHA256");
  signer.update(data);
  signer.end();

  const signature = signer.sign(users[username].wallet.privateKey, "hex");

  users[username].data=[{ data, signature }];
  backupUsers[username].data = [{ data, signature }];


  res.json(users[username].data);
});

// GET to verify user data
router.get("/verify", authenticateToken, (req, res) => {
  const { username } = (req as any).user;
  const userMainData = users[username];

  if (!userMainData || !userMainData.data.length) {
    return res.status(404).send("No data found for user.");
  }

  // Assuming there is only one data entry for each user
  const dataEntry = userMainData.data[0];

  const verifier = createVerify("SHA256");
  verifier.update(dataEntry.data); // Update verifier with the actual data string
  verifier.end();

  const isVerified = verifier.verify(
    userMainData.wallet.publicKey,
    dataEntry.signature,
    "hex"
  );

  res.json({ isVerified });
});

// GET to recover data from backup
router.get("/backup", authenticateToken, (req, res) => {
  const username = (req as any).user.username;

  // Copy data from backup database to main database
  users[username] = { ...backupUsers[username] };

  res.json(users[username].data);
});

// GET the entire main database
router.get("/maindb", authenticateToken, (req, res) => {
  // In a real application, make sure this endpoint is protected and only accessible by authorized users
  res.json({ users: users });
});

// GET the entire backup database
router.get("/backupdb", authenticateToken, (req, res) => {
  // In a real application, make sure this endpoint is protected and only accessible by authorized users
  res.json({ backupUsers: backupUsers });
});


// POST to tamper user data intentionally by replacing it
router.post("/tamperData", authenticateToken, (req, res) => {
  const { username } = (req as any).user;
  const { newData } = req.body;  // newData is the tampered data

  if (!users[username] || !users[username].data.length) {
    return res.status(404).send('No data found for user.');
  }

  // Intentionally tamper the data
  users[username].data[0].data = newData;  // Replace the existing data with the tampered data

  // Optionally, you could also tamper the data in the backup
  // backupUsers[username].data[0].data = newData;

  res.status(200).send('Data has been tampered.');
});



export default router;
