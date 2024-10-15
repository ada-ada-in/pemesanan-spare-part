import { verifyToken } from "../../../utils/authorization.js";
import {
  createSparePart,
  getCountSparePart,
  getSparePartByMotorId,
  getSparePart,
  getSparePartById,
  updateSparePart,
  deleteSparePart,
} from "./sparepart.controller.js";

import express from "express";
const router = express.Router();

router.post("/sparepart", verifyToken, createSparePart);
router.get("/sparepart", verifyToken, getSparePart);
router.get("/sparepartbymotor", verifyToken, getSparePartByMotorId);
router.get("/countsparepart", verifyToken, getCountSparePart);
router.get("/sparepart/:id", verifyToken, getSparePartById);
router.put("/sparepart/:id", verifyToken, updateSparePart);
router.delete("/sparepart/:id", verifyToken, deleteSparePart);

export default router;
