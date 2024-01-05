import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import crypto from "crypto";
import https from "https";
import http from "http";
import fs from "fs";

const PORT_HTTP = 8080; // Port for HTTP
const PORT_HTTPS = 8443; // Port for HTTPS
const app = express();

type DBProps = {
  hash?: string;
  data?: string;
};

let database: DBProps = { 
  data: "Username", 
  hash: "" 
};

let backup: DBProps = {};

app.use(cors());
app.use(express.json());

function createHash(data: string) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

const checkDataIntegrity = (req: Request, res: Response, next: NextFunction) => {
  const { data, hash } = req.body;

  // Verify data integrity on the server side.
  const currentHash = createHash(data);

  if (currentHash === hash) {
    // Continue to the next middleware if data integrity is verified.
    next();
  } else {
    //Integrity check failed.
    res.status(400).json({ isVerified: false });
  }
};


// Routes

//End point
app.get("/", (req, res) => {
  res.json(database);
});

//End point to update data
app.post("/", (req, res) => {
  const data = req.body.data;
  backup = { ...database };
  database.data = data;
  database.hash = createHash(data);
  res.status(200).json({ isVerified: true });
});

//End point to verify data integrity
app.post("/verify", checkDataIntegrity, (req, res) => {
  res.status(200).json({ isVerified: true });
});

//End point to recover data
app.get("/recover", (req, res) => {
  database = { ...backup };
  res.json(database);
});

// Creating an HTTP server to redirect to HTTPS
const httpServer = http.createServer((req, res) => {
  //Redirecting the request to use https to provide a better secure communication between client and server.
  const hostName =  req.headers['host']?.split(":")[0];
  res.writeHead(301, { "Location": "https://" + hostName + ":" + PORT_HTTPS + req.url });
  res.end();
});

httpServer.listen(PORT_HTTP, () => {
  console.log("HTTP Server running on port " + PORT_HTTP);
});

// Create an HTTPS server
const privateKey = fs.readFileSync("client-1.local.key", "utf8");
const certificate = fs.readFileSync("client-1.local.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT_HTTPS, () => {
  console.log("Server running on port " + PORT_HTTPS);
});