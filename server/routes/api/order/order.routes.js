import { verifyToken } from "../../../utils/authorization.js";
import {
  CreateOrder,
  getOrderByUser,
  getOrderByCartItem,
  uploadImage,
  getOrderByProses,
  getOrderProsesById,
  getOrderId,
  updateTransaksi,
  getOrderTransaksi,
  searchOrders,
} from "./order.controller.js";
import express from "express";
const router = express.Router();
import { upload } from "../../../utils/uploadImage.js";

router.post("/order", verifyToken, CreateOrder);
router.put("/upload/:id", upload.single("image"), verifyToken, uploadImage);
router.put("/updatetransaksi/:id", verifyToken, updateTransaksi);
router.get("/proses/:id_cart", verifyToken, getOrderProsesById);
router.get("/userorder", verifyToken, getOrderByUser);
router.get("/prosesorderid/:id", verifyToken, getOrderId);
router.get("/userorder/:id_cart", verifyToken, getOrderByCartItem);
router.get("/proses", verifyToken, getOrderByProses);
router.get("/transaksi", verifyToken, getOrderTransaksi);
router.get("/search", verifyToken, searchOrders);

export default router;
