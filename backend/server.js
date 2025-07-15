import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./db/connDb.js";
import urlRoutes from "./routes/url.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

connectDb();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Routes
app.use("/api/", urlRoutes);

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);