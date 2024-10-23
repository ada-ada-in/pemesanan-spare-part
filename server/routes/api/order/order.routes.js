import { verifyToken } from "../../../utils/authorization.js";
import {
  CreateOrder,
  getOrderByUser,
  getOrderByCartItem,
} from "./order.controller.js";
import express from "express";
const router = express.Router();

router.post("/order", verifyToken, CreateOrder);
router.get("/userorder", verifyToken, getOrderByUser);
router.get("/userorder/:id_cart", verifyToken, getOrderByCartItem);

export default router;
