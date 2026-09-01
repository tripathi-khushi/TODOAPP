import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';
import Todo from './models/Todo.js';
import { sampleTodos } from './seeds/seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/todos', todoRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
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

    // Check if database needs initial seeding
    const count = await Todo.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Populating with initial reference sample todos...');
      await Todo.insertMany(sampleTodos);
      console.log('Sample todos seeded successfully.');
    }

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Smartech Todo Server running on port ${PORT}`);
      console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📋 Todos API:        http://localhost:${PORT}/api/todos`);
      console.log(`📊 Stats API:        http://localhost:${PORT}/api/todos/stats`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();
