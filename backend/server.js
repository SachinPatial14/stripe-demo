import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

connectDB();

// Normal JSON
app.use(express.json());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// Test
app.get("/", (req, res) => {
  res.send("Stripe Server is running");
});

app.use("/", paymentRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
