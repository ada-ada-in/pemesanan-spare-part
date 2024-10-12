import { createMotor, getMotor } from "./motor.controller.js";

import express from "express";
const router = express.Router();

router.post("/motor", createMotor);
router.get("/motor", getMotor);

export default router;
