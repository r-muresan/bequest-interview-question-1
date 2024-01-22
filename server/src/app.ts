import express from "express";
import cors from "cors";
import Route from "./routes";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Routes
Route(app);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
