import express from "express";
import auth from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  updateUser,
} from "../controllers/authController.js";

const router = express.Router();

/*
========================
 AUTH ROUTES
========================
*/
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", auth, updateUser);

export default router;