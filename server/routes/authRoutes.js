import express from "express";
import auth from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  updateUser,
  verifyEmailOtp,
  resendEmailOtp,
} from "../controllers/authController.js";

const router = express.Router();

/*
========================
 AUTH ROUTES
========================
*/
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmailOtp);
router.post("/resend-verification", resendEmailOtp);
router.put("/update", auth, updateUser);

export default router;
