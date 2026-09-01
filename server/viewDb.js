import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Todo from './models/Todo.js';

dotenv.config();

const viewDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartech_todo';

  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('✅ Connected to MongoDB successfully.\n');

    // 1. Fetch Users
    const users = await User.find().select('-password');
    console.log('====================================================');
    console.log(`👤 REGISTERED USERS IN DATABASE (${users.length})`);
    console.log('====================================================');
    if (users.length === 0) {
      console.log('No users registered in database yet.\n');
    } else {
      console.table(users.map(u => ({
        ID: u._id.toString(),
        Name: u.name,
        Email: u.email,
        StudentID: u.studentId,
        Major: u.major,
        CreatedAt: u.createdAt ? u.createdAt.toLocaleString() : 'N/A',
      })));
      console.log('\n');
    }

    // 2. Fetch Todos
    const todos = await Todo.find().populate('user', 'name email');
    console.log('====================================================');
    console.log(`📋 SAVED TODOS IN DATABASE (${todos.length})`);
    console.log('====================================================');
    if (todos.length === 0) {
      console.log('No tasks stored in database yet.\n');
    } else {
      console.table(todos.map(t => ({
        ID: t._id.toString(),
        Title: t.title,
        Category: t.category,
        Priority: t.priority,
        Status: t.status,
        Completed: t.isCompleted ? '✅' : '❌',
        Owner: t.user ? t.user.name : 'Guest',
        Subtasks: t.subtasks ? `${t.subtasks.filter(s => s.isCompleted).length}/${t.subtasks.length}` : '0/0',
        DueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A',
      })));
      console.log('\n');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Could not connect to standalone MongoDB:', err.message);
    console.log('\n💡 Tip: To inspect the embedded in-memory database while the server is running, use the REST API:');
    console.log('   - View Todos: http://localhost:5000/api/todos');
    console.log('   - View Stats: http://localhost:5000/api/todos/stats\n');
    process.exit(1);
  }
};

viewDatabase();
