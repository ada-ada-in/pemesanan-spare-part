import express from "express";
import AuthRouter from "./routes/api/auth/auth.route.js";

const app = express();

app.use(express.json());

// Route
app.use("/", AuthRouter);

export default app;
