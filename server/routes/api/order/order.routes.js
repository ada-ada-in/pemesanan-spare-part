import { verifyToken } from "../../../utils/authorization.js";
import {
  CreateOrder,
  getOrderByUser,
  getOrderByCartItem,
  uploadImage,
} from "./order.controller.js";
import express from "express";
const router = express.Router();
import { upload } from "../../../utils/uploadImage.js";

router.post("/order", verifyToken, CreateOrder);
router.put("/upload/:id", upload.single("image"), verifyToken, uploadImage);
router.get("/userorder", verifyToken, getOrderByUser);
router.get("/userorder/:id_cart", verifyToken, getOrderByCartItem);

export default router;
