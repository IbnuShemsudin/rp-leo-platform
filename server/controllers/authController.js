import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { sendOtpEmail } from "../utils/brevoEmail.js";
import {
  getEmailVerificationTemplate,
  getPartnerRegisteredTemplate,
} from "../utils/emailTemplates.js";
import {
  notifyAdminsInApp,
  notifyAdminsEmail,
} from "../utils/notifyAdmins.js";

/*
ROLE SECRET CODES
You can move these to .env later for better security
*/

const ROLE_SECRET_CODES = {
  admin: String(process.env.ADMIN_SECRET_CODE || "").trim(),
  executive: String(process.env.EXECUTIVE_SECRET_CODE || "").trim(),
  staff: "",
};

/*
REGISTER USER
POST /api/auth/register
*/

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      secretCode,
    } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        msg: "Please provide all required fields",
      });
    }

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!strongPasswordPattern.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    /*
    CHECK IF USER EXISTS
    */

    const { data: existingUser, error: existingError } =
      await supabase
        .from("users")
        .select("*")
        .eq("email", normalizedEmail)
        .maybeSingle();

    if (existingUser) {
      return res.status(400).json({
        msg: existingUser.email_verified
          ? "User already exists"
          : "This email is awaiting verification. Request a new code.",
        verificationRequired: !existingUser.email_verified,
      });
    }

    /*
    SECRET CODE VALIDATION
    Only admin and executive require secret code
    */

    if (role === "admin" || role === "executive") {
      const requiredCode = ROLE_SECRET_CODES[role];

      if (!secretCode || secretCode !== requiredCode) {
        return res.status(403).json({
          msg: `Invalid secret code for ${role}`,
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    /*
    CREATE USER
    */

    const { data: user, error: createError } =
      await supabase
        .from("users")
        .insert([
          {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role,
            email_verified: false,
          },
        ])
        .select()
        .single();

    if (createError) {
      console.error("Create User Error:", createError);

      return res.status(500).json({
        msg: createError.message,
      });
    }

    if (role === "staff" || role === "partner") {
      try {
        await Promise.all([
          notifyAdminsInApp({
            title: "New partner registered",
            message: `${user.name} registered with ${user.email} and is awaiting email verification.`,
            link: "/dashboard",
          }),
          notifyAdminsEmail({
            subject: "[RP-LEO System] New Partner Registration",
            htmlContent: getPartnerRegisteredTemplate(user.name, user.email, role),
          }),
        ]);
      } catch (notificationError) {
        console.error("Admin signup notification error:", notificationError.message);
      }
    }

    try {
      await issueEmailOtp(user);
    } catch (emailError) {
      console.error("Verification email error:", emailError.message);
      return res.status(503).json({
        msg: "Account created, but the verification code could not be delivered. Please use resend code.",
        verificationRequired: true,
        email: user.email,
      });
    }

    res.status(201).json({
      msg: "Verification code sent to your email",
      verificationRequired: true,
      email: user.email,
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      msg: "Server error during registration",
    });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const code = String(req.body.code || "").trim();
    if (!email || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ msg: "Enter the six-digit verification code." });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error || !user) return res.status(400).json({ msg: "Verification request not found." });
    if (user.email_verified) return res.status(400).json({ msg: "Email is already verified. Please sign in." });
    if ((user.email_otp_attempts || 0) >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ msg: "Too many attempts. Request a new code." });
    }
    if (!user.email_otp_hash || !user.email_otp_expires_at || new Date(user.email_otp_expires_at) < new Date()) {
      return res.status(400).json({ msg: "This code has expired. Request a new one." });
    }

    const valid = await bcrypt.compare(code, user.email_otp_hash);
    if (!valid) {
      await supabase
        .from("users")
        .update({ email_otp_attempts: (user.email_otp_attempts || 0) + 1 })
        .eq("id", user.id);
      return res.status(400).json({ msg: "Incorrect verification code." });
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        email_otp_hash: null,
        email_otp_expires_at: null,
        email_otp_attempts: 0,
        email_otp_last_sent_at: null,
      })
      .eq("id", user.id);
    if (updateError) return res.status(500).json({ msg: "Could not verify email." });

    return res.json({
      msg: "Email verified successfully",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ msg: "Unable to verify email." });
  }
};

export const resendEmailOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ msg: "Email is required." });

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error || !user || user.email_verified) {
      return res.json({ msg: "If this account needs verification, a code has been sent." });
    }

    const lastSent = new Date(user.email_otp_last_sent_at || 0).getTime();
    const retryAfter = OTP_RESEND_COOLDOWN_SECONDS * 1000 - (Date.now() - lastSent);
    if (retryAfter > 0) {
      return res.status(429).json({
        msg: `Please wait ${Math.ceil(retryAfter / 1000)} seconds before requesting another code.`,
      });
    }

    await issueEmailOtp(user);
    return res.json({ msg: "A new verification code has been sent." });
  } catch (error) {
    console.error("OTP resend error:", error);
    return res.status(500).json({ msg: "Unable to resend verification code." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "Authorization required" });
    }

    if (!name && !email && !password) {
      return res.status(400).json({ msg: "Please provide at least one field to update" });
    }

    if (email) {
      const { data: existingUser, error: existingError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .neq("id", userId)
        .single();

      if (existingError && existingError.code !== "PGRST116") {
        console.error("Email check error:", existingError);
        return res.status(500).json({ msg: "Failed to validate email" });
      }

      if (existingUser) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    const updatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (name) updatePayload.name = name;
    if (email) updatePayload.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatePayload.password = await bcrypt.hash(password, salt);
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Update user error:", updateError);
      return res.status(500).json({ msg: updateError.message || "Unable to update user" });
    }

    return res.json({
      success: true,
      user: {
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Update user exception:", error);
    res.status(500).json({ msg: "Server error while updating user" });
  }
};
/*
LOGIN USER
POST /api/auth/login
*/

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        msg: "Please provide email and password",
      });
    }

    /*
    FIND USER
    */

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", normalizedEmail)
      .single();

    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    /*
    CHECK PASSWORD
    */

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        msg: "Verify your email before signing in.",
        verificationRequired: true,
        email: user.email,
      });
    }

    /*
    GENERATE TOKEN
    */

    const token = createToken(user);

    res.status(200).json({
      msg: "Login successful",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      msg: "Server error during login",
    });
  }
};

const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

const createToken = (user) => jwt.sign(
  { id: user.id, role: user.role, name: user.name, email: user.email },
  process.env.JWT_SECRET || "supersecretkey",
  { expiresIn: "7d" }
);

const publicUser = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const issueEmailOtp = async (user) => {
  const code = crypto.randomInt(100000, 1000000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
  const { error } = await supabase
    .from("users")
    .update({
      email_otp_hash: await bcrypt.hash(code, 10),
      email_otp_expires_at: expiresAt.toISOString(),
      email_otp_attempts: 0,
      email_otp_last_sent_at: now.toISOString(),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  await sendOtpEmail({
    to: user.email,
    subject: "Your RP-LEO email verification code",
    htmlContent: getEmailVerificationTemplate(user.name, code, OTP_EXPIRY_MINUTES),
  });
};
