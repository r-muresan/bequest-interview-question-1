import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();
const database = { data: "Hello World", hash: "123456789" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (_, res) => {
	res.json(database);
});

app.post("/", (req, res) => {
	database.data = req.body.data;
	database.hash = req.body.hash;
	res.sendStatus(200);
});

app.get("/hack", (_, res) => {
	database.data = "Hacked";
	res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
