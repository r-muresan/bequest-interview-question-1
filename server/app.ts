import express from "express";
import cors from "cors";
import https from "https"
import fs from "fs"

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };
const allowedOrigins = ["http://localhost:3000"]; //whitelisting only myself for additional security

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS does not allow this origin to call to this server"));
    }
  },
}));
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  console.log("database", database)
  res.json(database);
});

app.post("/", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  res.charset = "utf-8";
  database.data = req.body.hashedData;
  console.log("received", database)
  res.sendStatus(200);
});

const httpsOptions = { //certificates that I myself created for this protocol
  key: fs.readFileSync('./certs/cert.key'),
  cert: fs.readFileSync('./certs/cert.crt'),
};

https.createServer(httpsOptions, app).listen(PORT, () => { //created and https server
  console.log("Server running on port " + PORT);
});
