import { register } from "./auth.controller.js";

import express from "express";
const router = express.Router();

router.post("/", register);

export default router;
