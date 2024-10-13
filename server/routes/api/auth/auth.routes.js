import { verifyToken } from "../../../utils/authorization.js";
import {
  register,
  login,
  logout,
  getRoleWhenLogin,
} from "./auth.controller.js";

import express from "express";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", verifyToken, logout);
router.get("/getrolewhenlogin", verifyToken, getRoleWhenLogin);

export default router;
