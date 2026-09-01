import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

// @desc    Get all todos with filtering, sorting, and search
// @route   GET /api/todos
export const getTodos = async (req, res) => {
  try {
    const { search, status, category, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    // Search keyword in title or description or tags
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      if (status === 'Completed') {
        query.isCompleted = true;
      } else if (status === 'Pending') {
        query.status = 'Pending';
      } else if (status === 'In Progress') {
        query.status = 'In Progress';
      }
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Sort configuration
    const sortOptions = {};
    const sortDirection = order === 'asc' ? 1 : -1;

    if (sortBy === 'dueDate') {
      sortOptions.dueDate = sortDirection;
    } else if (sortBy === 'priority') {
      // Custom priority weighting if needed or alpha
      sortOptions.priority = sortDirection;
    } else if (sortBy === 'title') {
      sortOptions.title = sortDirection;
    } else {
      sortOptions.createdAt = sortDirection;
    }

    const todos = await Todo.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error('Error in getTodos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todos',
      error: error.message,
    });
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Todo ID format: ${id}`,
      });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo item not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error('Error in getTodoById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todo details',
      error: error.message,
    });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
export const createTodo = async (req, res) => {
  try {
    const { title, description, category, priority, status, dueDate, time, subtasks, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const isCompleted = status === 'Completed';

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Academic',
      priority: priority || 'Medium',
      status: status || 'Pending',
      isCompleted,
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: time || '12:00',
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo,
    });
  } catch (error) {
    console.error('Error in createTodo:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create todo',
    });
  }
};

// @desc    Update a todo completely
// @route   PUT /api/todos/:id
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Todo ID format: ${id}`,
      });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo item not found with ID: ${id}`,
      });
    }

    const { title, description, category, priority, status, isCompleted, dueDate, time, subtasks, tags } = req.body;

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (category !== undefined) todo.category = category;
    if (priority !== undefined) todo.priority = priority;
    if (time !== undefined) todo.time = time;
    if (dueDate !== undefined) todo.dueDate = new Date(dueDate);
    if (tags !== undefined) todo.tags = tags;
    if (subtasks !== undefined) todo.subtasks = subtasks;

    if (status !== undefined) {
      todo.status = status;
      todo.isCompleted = status === 'Completed';
    } else if (isCompleted !== undefined) {
      todo.isCompleted = isCompleted;
      todo.status = isCompleted ? 'Completed' : 'Pending';
    }

    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Error in updateTodo:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update todo',
    });
  }
};

// @desc    Partial update (e.g. toggle complete, toggle subtask)
// @route   PATCH /api/todos/:id
export const patchTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Todo ID format: ${id}`,
      });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo item not found with ID: ${id}`,
      });
    }

    // Check specific patch operations
    const { isCompleted, status, subtaskId, subtaskCompleted, newSubtask } = req.body;

    if (typeof isCompleted === 'boolean') {
      todo.isCompleted = isCompleted;
      todo.status = isCompleted ? 'Completed' : 'Pending';
    }

    if (status) {
      todo.status = status;
      todo.isCompleted = status === 'Completed';
    }

    // Toggle specific subtask
    if (subtaskId && typeof subtaskCompleted === 'boolean') {
      const subtask = todo.subtasks.id(subtaskId);
      if (subtask) {
        subtask.isCompleted = subtaskCompleted;
      }
    }

    // Add new subtask
    if (newSubtask && typeof newSubtask.title === 'string' && newSubtask.title.trim()) {
      todo.subtasks.push({
        title: newSubtask.title.trim(),
        isCompleted: false,
      });
    }

    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo status updated',
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Error in patchTodo:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to patch todo',
    });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Todo ID format: ${id}`,
      });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo item not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error in deleteTodo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting todo',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics for gauges and summary cards
// @route   GET /api/todos/stats
export const getTodoStats = async (req, res) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ isCompleted: true });
    const inProgress = await Todo.countDocuments({ status: 'In Progress' });
    const pending = await Todo.countDocuments({ status: 'Pending' });

    // Academic / Homework specific
    const academicTotal = await Todo.countDocuments({ category: 'Academic' });
    const academicCompleted = await Todo.countDocuments({ category: 'Academic', isCompleted: true });

    // Projects specific
    const projectsTotal = await Todo.countDocuments({ category: 'Projects' });
    const projectsCompleted = await Todo.countDocuments({ category: 'Projects', isCompleted: true });

    // Calculate rates
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const homeworkRate = academicTotal > 0 ? Math.round((academicCompleted / academicTotal) * 100) : 90;
    const attendanceRate = 60; // Styled reference gauge
    const ratingScore = total > 0 ? Math.min(100, Math.round(75 + (completionRate * 0.2))) : 75;

    // Upcoming schedule tasks
    const upcomingSchedule = await Todo.find({
      isCompleted: false,
    })
      .sort({ dueDate: 1, time: 1 })
      .limit(4);

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        inProgress,
        pending,
        completionRate,
        homeworkRate,
        attendanceRate,
        ratingScore,
        upcomingSchedule,
      },
    });
  } catch (error) {
    console.error('Error in getTodoStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: error.message,
    });
  }
};
