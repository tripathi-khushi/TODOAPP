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
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Optional Auth endpoints (returns user-specific data if logged in, or empty guest state)
router.get('/stats', optionalAuth, getTodoStats);
router.get('/', optionalAuth, getTodos);
router.get('/:id', optionalAuth, getTodoById);

// Protected Write Endpoints (Strictly require active user token)
router.post('/', protect, createTodo);
router.put('/:id', protect, updateTodo);
router.patch('/:id', protect, patchTodo);
router.delete('/:id', protect, deleteTodo);

export default router;
