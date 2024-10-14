import { verifyToken } from "../../../utils/authorization.js";
import {
  createMotor,
  getMotor,
  deleteMotor,
  updateMotor,
  getMotorById,
} from "./motor.controller.js";

import express from "express";
const router = express.Router();

router.post("/motor", verifyToken, createMotor);
router.get("/motor", getMotor);
router.get("/motor/:id", getMotorById);
router.put("/motor/:id", verifyToken, updateMotor);
router.delete("/motor/:id", verifyToken, deleteMotor);

export default router;
