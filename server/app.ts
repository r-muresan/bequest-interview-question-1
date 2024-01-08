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

//regular get and post
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

//dealing with the backup system
app.get("/backup-data", (req, res)=>{
    const backupsFile = fs.readFileSync('backup-copy.json', 'utf-8');
    const backupDataCopy = JSON.parse(backupsFile);
    res.json(backupDataCopy);
})

app.post("/backup-data", (req, res) => { //only backs up the one relevant piece of data, does not keep a log
  try {
    const backupDataCopy = {timestamp: new Date(), data: database.data}
    fs.writeFileSync('backup-copy.json', JSON.stringify(backupDataCopy, null, 2), 'utf-8');
    res.sendStatus(200);
  
  } catch (error) {
    console.error('Error writing backup data:', error);
    res.status(500).json({ success: false, error: 'Internal server error at the try-catch' });
  }
});

app.post("/restore-data", (req, res)=>{
  const backupsFile = fs.readFileSync('backup-copy.json', 'utf-8');
  const backupDataCopy = JSON.parse(backupsFile);
  database.data = backupDataCopy.data
  res.json(backupDataCopy.timestamp); //if you ever need the timestamp for whatever reason
})

//THIS IS FOR DEVS FOR TEST ONLY: easy way to tamper with the live db to show that the backup copy works
app.post("/tamper-live-db", (req, res)=>{
  database.data = "aaaaaaaah haha you have officially been messed with"
})

const httpsOptions = { //certificates that I myself created for this protocol
  key: fs.readFileSync('./certs/cert.key'),
  cert: fs.readFileSync('./certs/cert.crt'),
};

https.createServer(httpsOptions, app).listen(PORT, () => { //created and https server
  console.log("Server running on port " + PORT);
});
