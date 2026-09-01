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
import { seedTodos } from '../seeds/seedData.js';

const router = express.Router();

// Stats endpoint (must be declared before :id route)
router.get('/stats', getTodoStats);

// Seed route for easy setup / reset
router.post('/seed', async (req, res) => {
  try {
    const result = await seedTodos();
    res.status(200).json({
      success: true,
      message: 'Sample todos seeded successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed sample todos',
      error: error.message,
    });
  }
});

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
