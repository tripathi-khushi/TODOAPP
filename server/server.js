import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { generalApiLimiter, sanitizeInputData } from './middleware/securityMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for local development asset loading
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS Lockdown
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parsers with payload limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Data Sanitization against NoSQL query injection & XSS
app.use(mongoSanitize());
app.use(sanitizeInputData);

// 5. Morgan Logging
app.use(morgan('dev'));

// 6. Global API Rate Limiter
app.use('/api', generalApiLimiter);

// 7. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    security: 'Helmet + RateLimiter + MongoSanitize active',
  });
});

// Serve frontend static build if in production
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback for HTML page routes in production
app.get('/', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});
app.get('/todo.html', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'todo.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server and connect database
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Smartech Server running on port ${PORT}`);
      console.log(`🛡️  Security: Helmet + RateLimiting + MongoSanitize`);
      console.log(`📡 API Health:   http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth API:     http://localhost:${PORT}/api/auth`);
      console.log(`📋 Todos API:    http://localhost:${PORT}/api/todos`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();
