import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import trasactionRoute from "./routes/trasactionRoute.js"
dotenv.config();

const app = express();
app.use(express.json());
app.use(rateLimiter)
const PORT = process.env.PORT || 5001;


app.use("/api/transactions", trasactionRoute)


initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is started at PORT", PORT);
  });
});
