import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

// @desc    Get all todos with filtering, sorting, and search (strictly isolated per user)
// @route   GET /api/todos
export const getTodos = async (req, res) => {
  try {
    const { search, status, category, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Strict User Isolation: Authenticated user queries only their tasks
    if (!req.user || !req.user._id) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'Guest mode: Please log in to view and manage your personal tasks',
      });
    }

    const query = { user: req.user._id };

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

// @desc    Get single todo by ID (Strict ownership check)
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

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to view task details',
      });
    }

    const todo = await Todo.findOne({ _id: id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Task not found or you do not have permission to view it`,
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

// @desc    Create a new todo for authenticated user
// @route   POST /api/todos
export const createTodo = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to create and save tasks in your database',
      });
    }

    const { title, description, category, priority, status, dueDate, time, subtasks, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const isCompleted = status === 'Completed';

    const todo = await Todo.create({
      user: req.user._id,
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
      message: 'Task saved to database successfully',
      data: todo,
    });
  } catch (error) {
    console.error('Error in createTodo:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create task',
    });
  }
};

// @desc    Update a todo completely (Strict ownership check)
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

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to update tasks',
      });
    }

    const todo = await Todo.findOne({ _id: id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Task not found or you do not have permission to update it`,
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
      message: 'Task updated successfully in database',
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Error in updateTodo:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update task',
    });
  }
};

// @desc    Partial update (Strict ownership check)
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

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to update tasks',
      });
    }

    const todo = await Todo.findOne({ _id: id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Task not found or you do not have permission to modify it`,
      });
    }

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
      message: 'Task status updated in database',
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

// @desc    Delete a todo (Strict ownership check)
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

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to delete tasks',
      });
    }

    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Task not found or you do not have permission to delete it`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted from database successfully',
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

// @desc    Get dashboard statistics strictly isolated for authenticated user
// @route   GET /api/todos/stats
export const getTodoStats = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(200).json({
        success: true,
        data: {
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
          completionRate: 0,
          homeworkRate: 0,
          attendanceRate: 0,
          ratingScore: 0,
          upcomingSchedule: [],
        },
      });
    }

    const userQuery = { user: req.user._id };

    const total = await Todo.countDocuments(userQuery);
    const completed = await Todo.countDocuments({ ...userQuery, isCompleted: true });
    const inProgress = await Todo.countDocuments({ ...userQuery, status: 'In Progress' });
    const pending = await Todo.countDocuments({ ...userQuery, status: 'Pending' });

    // Academic / Homework specific
    const academicTotal = await Todo.countDocuments({ ...userQuery, category: 'Academic' });
    const academicCompleted = await Todo.countDocuments({ ...userQuery, category: 'Academic', isCompleted: true });

    // Calculate rates dynamically
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const homeworkRate = academicTotal > 0 ? Math.round((academicCompleted / academicTotal) * 100) : (total > 0 ? completionRate : 0);
    const attendanceRate = total > 0 ? Math.min(100, Math.round(50 + (completionRate * 0.5))) : 0;
    const ratingScore = total > 0 ? Math.min(100, Math.round(60 + (completionRate * 0.4))) : 0;

    // Upcoming schedule tasks from database
    const upcomingSchedule = await Todo.find({
      ...userQuery,
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
