import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

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

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        msg: "Please provide all required fields",
      });
    }

    /*
    CHECK IF USER EXISTS
    */

    const { data: existingUser, error: existingError } =
      await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists",
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
            email,
            password: hashedPassword,
            role,
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

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "supersecretkey",
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      msg: "Registration successful",
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      msg: "Server error during registration",
    });
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
      .eq("email", email)
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

    /*
    GENERATE TOKEN
    */

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "supersecretkey",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      msg: "Server error during login",
    });
  }
};