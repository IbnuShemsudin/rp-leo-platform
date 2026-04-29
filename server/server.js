require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const morgan = require('morgan'); // Recommended: For logging requests
const path = require('path'); // ✅ Added for file uploads

const app = express();

// 1. Database Connection
connectDB();

// 2. Global Middleware
app.use(cors()); // Allows your React frontend (port 5173) to talk to this server
app.use(express.json({ limit: '10mb' })); // Increased limit for potential document uploads
app.use(morgan('dev')); // Logs every request to the terminal (e.g., "POST /api/auth/login 400")

// ✅ 3. Static Uploads Folder (NEW)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Health Check Route (Great for testing if the server is alive)
app.get('/status', (req, res) => {
  res.json({ 
    status: 'Operational', 
    timestamp: new Date().toISOString(),
    system: 'SSGI RP-LEO Backend'
  });
});

// 4. API Routes
app.use('/api/mou', require('./routes/mouRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// ✅ 5. Upload Route (NEW)
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use("/api/notifications", require('./routes/notificationRoutes'));
// 6. Global Error Handler (Catches malformed JSON or server crashes)
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ 
    msg: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 RP-LEO Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
  console.log(`-----------------------------------------`);
});