import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import paymentRoutes from "./routes/paymentRoutes.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Stripe Backend Running");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
