import { register, login, logout } from "./auth.controller.js";

import express from "express";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);

export default router;
