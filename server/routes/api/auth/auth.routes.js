import { verifyToken } from "../../../utils/authorization.js";
import {
  register,
  login,
  logout,
  //   getDataWhenLogin,
} from "./auth.controller.js";

import express from "express";
const router = express.Router();

router.post("/register", verifyToken, register);
router.post("/login", login);
router.delete("/logout", logout);
// router.get("/userlogin", getDataWhenLogin);

export default router;
