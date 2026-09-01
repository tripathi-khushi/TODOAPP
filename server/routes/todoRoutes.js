import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  patchTodo,
  deleteTodo,
  getTodoStats,
} from '../controllers/todoController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply optionalAuth to all routes
router.use(optionalAuth);

// Stats endpoint
router.get('/stats', getTodoStats);

// Root /api/todos routes
router.route('/')
  .get(getTodos)
  .post(createTodo);

// Item specific /api/todos/:id routes
router.route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .patch(patchTodo)
  .delete(deleteTodo);

export default router;
