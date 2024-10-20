import { verifyToken } from "../../../utils/authorization.js";
import { CreateOrder } from "./order.controller.js";
import express from "express";
const router = express.Router();

router.post("/order", verifyToken, CreateOrder);

export default router;
