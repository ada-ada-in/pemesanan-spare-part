import express from "express";
import cors from "cors";
import AuthRouter from "./routes/api/auth/auth.routes.js";
import MotorRouter from "./routes/api/motor/motor.routes.js";
import SparePartRouter from "./routes/api/sparepart/sparepart.routes.js";
import OrderRouter from "./routes/api/order/order.routes.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Route
app.use(AuthRouter);
app.use(MotorRouter);
app.use(SparePartRouter);
app.use(OrderRouter);

export default app;
