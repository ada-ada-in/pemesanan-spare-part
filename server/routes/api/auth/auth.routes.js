import { verifyToken } from "../../../utils/authorization.js";
import {
  register,
  login,
  logout,
  getRoleWhenLogin,
  getCountAccount,
  getAccount,
  deleteAccount,
  updateAccount,
  getUserById,
} from "./auth.controller.js";

import express from "express";
const router = express.Router();

router.get("/user", verifyToken, getAccount);
router.get("/user/:id", verifyToken, getUserById);
router.get("/countuser", verifyToken, getCountAccount);
router.get("/getrolewhenlogin", verifyToken, getRoleWhenLogin);
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", verifyToken, logout);
router.delete("/user/:id", verifyToken, deleteAccount);
router.put("/user/:id", updateAccount);

export default router;
