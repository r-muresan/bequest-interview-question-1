import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { query } from "express-validator";
import { database, clients } from "./database";

const PORT = 8080;
const app = express();

// List to limit origin and type of requests for CORS middleware
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000', // Will include any allowed URLs 
  methods: "GET,POST", // Limit to methods being used
  sameSite: "none",
  allowHeaders: ["Content-Type", "Authorization"]
}; 

// Middleware

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: crypto.randomUUID(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // 14 days
    secure: false, // should set secure = true for prod environment
    httpOnly: true,
  },
}))

const sessionValidation = function (req: Request, res: Response, next: NextFunction) {
  const csrfToken = crypto.randomUUID();
  const client = {sid: req.session.id, csrfToken: req.cookies?.csrf || csrfToken };

  const clientIndex = clients.findIndex((clientItem) => clientItem.sid === client.sid && clientItem.csrfToken === client.csrfToken);
  if (clientIndex === 1) {
    res.cookie("csrf", csrfToken);
    clients[clientIndex].csrfToken = csrfToken;
    next();
  }
  else if(clientIndex < 0) {
    clients.push(client);
    next();
  } else {
    res.status(400).send({msg: "Unauthorized user"});
  }
}

app.use(sessionValidation);

// Routes

// Get Data
app.get("/data", (req, res) => {
  res.json(database);
});

// Post Data
app.post("/data", query(['data', 'timestamp']).notEmpty().escape(), (req, res) => {
  const { data, timestamp } = req.body;
  if (req.session && data && timestamp) {
    database.sid = req.session.id;
    database.data = data;
    database.timestamp = timestamp;
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});