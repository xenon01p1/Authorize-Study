import express from "express";
import authRoute from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoute);

app.listen(3000, () => console.log("Listening server on 3000...."));