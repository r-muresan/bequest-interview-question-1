import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import dataRoutes from "./routes/dataRoutes";

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
