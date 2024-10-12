import express from "express";
import AuthRouter from "./routes/api/auth/auth.routes.js";
import MotorRouter from "./routes/api/motor/motor.routes.js";

const app = express();

app.use(express.json());

// Route
app.use(AuthRouter);
app.use(MotorRouter);

export default app;
