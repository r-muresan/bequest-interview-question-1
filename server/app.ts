import express from "express";
import cors from "cors";
import { SHA256 } from "crypto-js";

const PORT = 8080;
const app = express();
const database = { data: "Hello", version: 1 };

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const requestedVersion = req.query.version
    ? parseInt(req.query.version as string, 10)
    : 1;

  console.log("GET request received. Requested version:", requestedVersion);

  res.json({ data: database.data, version: requestedVersion });
});

app.post("/", (req, res) => {
  const newData = req.body.data || "";
  const receivedVersion = req.body.version || 1;
  const checksum = req.body.checksum || "";

  console.log("POST request received. New data:", newData);
  console.log("Received version:", receivedVersion);
  console.log("Received checksum:", checksum);

  // Verify data integrity
  const calculatedChecksum = SHA256(newData).toString();
  if (calculatedChecksum !== checksum) {
    console.log("Data integrity check failed");

     // Log details about the incident for analysis
     console.error("Data integrity compromised. Details:", {
      newData,
      receivedVersion,
      checksum,
      calculatedChecksum,
    });

    return res.status(400).send("Data integrity check failed");
  }

  // Increment version and update data
  console.log("Updating data. New version:", database.version + 1);
  database.data = newData;

  res.json({ version: database.version + 1 });

  database.version += 1;
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
