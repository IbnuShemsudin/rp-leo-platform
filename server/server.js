import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Routes

import mouRoutes from "./routes/mouRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messages.js";
import inboxRoutes from "./routes/inbox.js";
import auditRoutes from "./routes/auditRoutes.js";
import { startAuditWorker } from "./utils/auditQueue.js";


// Fix __dirname in ES Modules


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/*import { sendEmailNotification } from "./utils/email.js";

// Emergency test on server boot:
sendEmailNotification({
  to: "isrubest18@gmail.com",
  subject: "TEST EMAIL ON BOOT",
  htmlContent: "<h1>If you get this, Nodemailer is working!</h1>",
}).then(() => console.log("✅ BOOT EMAIL FINISHED"))
  .catch((err) => console.error("❌ BOOT EMAIL FAILED:", err));*/
/*
========================
 ENSURE UPLOADS FOLDER EXISTS
========================
*/

const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 uploads folder created");
}

/*
========================
 MIDDLEWARE (UPDATED FOR PRODUCTION DEPLOYMENT)
========================
*/

// Allowed origins: Your Vercel frontend URL and local development port
const allowedOrigins = [
  "https://rp-leo-platform.vercel.app",  // Your main live Vercel URL
  "https://rp-leo-platform.vercel.app/",  // Catch trailing slash variations
  "http://localhost:5173"                  // Keeps local Vite testing working
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Fix: Check explicit array match OR dynamic Vercel previews/branches
      const isAllowed = allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app");

      if (!isAllowed) {
        console.warn(`🛑 Blocked by CORS: Origin [${origin}] is not authorized.`);
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

/*
========================
 STATIC FILES
========================
*/

app.use(
  "/uploads",
  express.static(uploadsPath)
);

/*
========================
 DEBUG ROUTES
========================
*/

app.get("/uploads-check", (req, res) => {
  try {
    const files = fs.readdirSync(uploadsPath);

    res.json({
      success: true,
      uploadsFolder: uploadsPath,
      totalFiles: files.length,
      files,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
========================
 HEALTH CHECK
========================
*/

app.get("/status", (req, res) => {
  res.json({
    status: "Operational",
    timestamp: new Date().toISOString(),
    system: "SSGI RP-LEO Backend",
  });
});

/*
========================
 API ROUTES
========================
*/

app.use("/api/mou", mouRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/inbox", inboxRoutes);

app.use("/api/audit", auditRoutes);

/*
========================
 TEST PDF ROUTE
========================
*/

app.get("/test-pdf/:file", (req, res) => {
  const filePath = path.join(
    uploadsPath,
    req.params.file
  );

  console.log("📄 Checking file:", filePath);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      msg: "PDF not found",
      searched: filePath,
    });
  }

  res.sendFile(filePath);
});

/*
========================
 404 HANDLER
========================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: `Route not found: ${req.originalUrl}`,
  });
});

/*
========================
 GLOBAL ERROR HANDLER
========================
*/

app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);

  res.status(500).json({
    success: false,
    msg: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : {},
  });
});



/*
========================
 START SERVER
========================
*/



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  startAuditWorker();
  console.log("-----------------------------------------");
  console.log(`🚀 RP-LEO Server running on port ${PORT}`);
  console.log(
    `📡 Environment: ${
      process.env.NODE_ENV || "development"
    }`
  );
  console.log(`📂 Uploads Path: ${uploadsPath}`);
  console.log(`🌐 Upload URL: http://localhost:${PORT}/uploads`);
  console.log("-----------------------------------------");
});




