import { verifyToken } from "../../../utils/authorization.js";
import {
  register,
  login,
  logout,
  getRoleWhenLogin,
} from "./auth.controller.js";

import express from "express";
const router = express.Router();

router.post("/register", verifyToken, register);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/getrolewhenlogin", verifyToken, getRoleWhenLogin);

export default router;
