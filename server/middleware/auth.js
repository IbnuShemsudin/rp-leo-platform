import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

const auth = async (req, res, next) => {
  try {
    // Support both the legacy custom header and standard Bearer auth.
    const authorization = req.header("authorization");
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : null;
    const token = req.header("x-auth-token") || bearerToken;

    // Check if no token
    if (!token) {
      return res.status(401).json({
        msg: "No token, authorization denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    );

    // Add the current account details for older tokens too.  Earlier tokens
    // only contained id/role, which left message senders unnamed and prevented
    // ownership checks that rely on email.
    const { data: account, error: accountError } = await supabase
      .from("users")
      .select("name, email, role")
      .eq("id", decoded.id)
      .maybeSingle();

    if (accountError) {
      console.error("Auth user lookup error:", accountError.message);
    }

    req.user = {
      ...decoded,
      name: account?.name || decoded.name,
      email: account?.email || decoded.email,
      role: account?.role || decoded.role,
    };

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);

    return res.status(401).json({
      msg: "Token is not valid or has expired",
    });
  }
};

export default auth;
