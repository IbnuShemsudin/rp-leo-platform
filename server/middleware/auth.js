import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token");

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

    // Add user from payload to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);

    return res.status(401).json({
      msg: "Token is not valid or has expired",
    });
  }
};

export default auth;