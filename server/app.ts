import express from "express";
import cors from "cors";
import { DataCreateAPI, IDatabase } from "./interfaces";
import { validate } from "class-validator";

const PORT = 8080;
const app = express();
const database: IDatabase = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", async (req, res) => {
  const newData = new DataCreateAPI()
  newData.data = req.body.data
  // verify input parameters
  const errors = await validate(newData);
  if (errors.length) {
    let message;
    if(errors[0].constraints?.minLength) {
      message = errors[0].constraints.minLength
    }
    else {
      message = errors[0].constraints?.maxLength
    }
    res.status(403).json({ message });
  }
  else {
    database.data = req.body.data;
    res.status(200).json({ message: "It´s all good, man" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
