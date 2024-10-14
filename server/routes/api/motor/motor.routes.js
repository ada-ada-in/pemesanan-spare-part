import {
  createMotor,
  getMotor,
  deleteMotor,
  updateMotor,
} from "./motor.controller.js";

import express from "express";
const router = express.Router();

router.post("/motor", createMotor);
router.get("/motor", getMotor);
router.put("/motor/:id", updateMotor);
router.delete("/motor/:id", deleteMotor);

export default router;
