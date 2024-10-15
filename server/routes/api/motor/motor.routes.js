import { verifyToken } from "../../../utils/authorization.js";
import {
  createMotor,
  getMotor,
  deleteMotor,
  updateMotor,
  getMotorById,
  getCountMotor,
} from "./motor.controller.js";

import express from "express";
const router = express.Router();

router.post("/motor", verifyToken, createMotor);
router.get("/motor", verifyToken, getMotor);
router.get("/countmotor", verifyToken, getCountMotor);
router.get("/motor/:id", verifyToken, getMotorById);
router.put("/motor/:id", verifyToken, updateMotor);
router.delete("/motor/:id", verifyToken, deleteMotor);

export default router;
