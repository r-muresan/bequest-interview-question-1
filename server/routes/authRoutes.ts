import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users, createUser } from "../models/userModel";

const router = express.Router();
const SALT_ROUNDS = 10;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "bequest_secret_key";

// Register User
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (users[username]) {
    return res.status(400).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  createUser(username, hashedPassword);

  res.status(201).send("User created successfully");
});

// Login User
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user == null || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid credentials");
  }

  const accessToken = jwt.sign({ username }, JWT_SECRET_KEY);
  res.json({ accessToken });
});

export default router;
