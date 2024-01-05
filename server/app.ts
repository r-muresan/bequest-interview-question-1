import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.ts";
import { verifyJWT } from "./middleware/auth.ts";
import { hash, compare } from "bcrypt-ts";

interface Data {
  data: string;
  version: number;
}
interface Database extends Data {
  hashedData: string;
  history: Data[];
}

const PORT = 8080;
const app = express();
const database: Database = {
  data: "Hello World",
  hashedData: "",
  version: 0,
  history: [],
};

/**
 * Adds new data to the database and maintains version history.
 * @param newData - The new data to be added to the database.
 */
const addData = (newData: string): void => {
  //avoid adding same version after data restore
  if (
    database.history.find((v) => v.version === database.version) === undefined
  ) {
    database.history.push({ data: database.data, version: database.version });
  }

  database.data = newData;
  database.version++;

  if (database.history.length > 10) {
    database.history.shift();
  }
};

/**
 * Reverts the database to its previous version.
 */
const revertToPreviousVersion = (): void => {
  const previousVersion = database.history[database.history.length - 1];
  if (previousVersion) {
    database.data = previousVersion.data;
    database.version = previousVersion.version;
  } else {
    console.error("something is wrong");
  }
};

//adding initial value for hashedData
const saltRounds = 10;
const initializeHashedData = async () => {
  database.hashedData = await hash(database.data, saltRounds);
};
initializeHashedData();

// adding origin make the server more secure
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", verifyJWT, async (req, res) => {
  res.json(database);
});

app.post("/", verifyJWT, async (req, res) => {
  try {
    database.hashedData = await hash(req.body.data, saltRounds);
    addData(req.body.data);
    res.sendStatus(200);
  } catch (error) {
    console.error("Hashing error:", error);
  }
});

// Route to verify if the current data has been tampered with (it will detect temperted data while server is on)
app.post("/verify", verifyJWT, async (req, res) => {
  try {
    //check if current data in database is same as the data that was hashed
    const isValid = await compare(database.data, database.hashedData);
    if (isValid) {
      res.json({ message: "Data is corrected!" });
    } else {
      res.status(500).json({ message: "Data is compromised!" });
    }
  } catch (error) {
    console.error("Hashing error:", error);
    res.status(500).json({ message: "Data is compromised!" });
  }
});

// Route to handle data restoration to a previous version
app.post("/restore", verifyJWT, async (req, res) => {
  try {
    if (database.version === 0) {
      return res.status(500).json({ message: "This is the initial data!" });
    }
    revertToPreviousVersion();
    database.hashedData = await hash(database.data, saltRounds);

    res
      .status(200)
      .json({ message: "Data has been restored!", data: database.data });
  } catch (error) {
    res.status(500).json({ message: "Data can't be restored!" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
