import Todo from '../models/Todo.js';

/**
 * Creates starter tasks for a newly registered and verified user in MongoDB.
 */
export const createStarterTasksForUser = async (userId, major = 'Robotics & AI Engineering') => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const inFiveDays = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const starterTasks = [
    {
      user: userId,
      title: 'Robotics Homework 15: Kinematics & PID Calibration',
      description: 'Implement forward and inverse kinematics calculations for 4-DOF robotic arm. Calibrate PID control constants.',
      category: 'Academic',
      priority: 'Urgent',
      status: 'In Progress',
      isCompleted: false,
      dueDate: tomorrow,
      time: '19:30',
      subtasks: [
        { title: 'Derive transformation matrices', isCompleted: true },
        { title: 'Tune proportional gain (Kp)', isCompleted: true },
        { title: 'Analyze steady-state error', isCompleted: false },
        { title: 'Submit simulation graphs', isCompleted: false },
      ],
      tags: ['Robotics', 'Kinematics', 'Lab 4'],
    },
    {
      user: userId,
      title: 'Electronics Lab: Sensor Integration & I2C Bus',
      description: 'Connect ultrasonic distance sensor and IMU 6050 to microcontroller over I2C bus. Filter noise with Kalman filter.',
      category: 'Projects',
      priority: 'High',
      status: 'Pending',
      isCompleted: false,
      dueDate: inThreeDays,
      time: '16:00',
      subtasks: [
        { title: 'Wire pull-up resistors on SDA/SCL lines', isCompleted: false },
        { title: 'Verify I2C address detection', isCompleted: false },
        { title: 'Record sensor drift in stationary state', isCompleted: false },
      ],
      tags: ['Hardware', 'I2C', 'Sensors'],
    },
    {
      user: userId,
      title: 'C++ Object-Oriented Software Design Assignment',
      description: 'Design a modular state machine architecture using modern C++17 smart pointers and templates.',
      category: 'Academic',
      priority: 'Medium',
      status: 'Completed',
      isCompleted: true,
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      time: '14:00',
      subtasks: [
        { title: 'Define abstract State base class', isCompleted: true },
        { title: 'Implement unit tests with Google Test', isCompleted: true },
      ],
      tags: ['C++', 'OOP', 'Software'],
    },
    {
      user: userId,
      title: 'Review Machine Learning Neural Network Weights',
      description: 'Train convolutional neural network on object detection dataset and measure validation loss curves.',
      category: 'Projects',
      priority: 'Low',
      status: 'Pending',
      isCompleted: false,
      dueDate: inFiveDays,
      time: '11:00',
      subtasks: [
        { title: 'Normalize input pixel tensors', isCompleted: false },
        { title: 'Evaluate confusion matrix', isCompleted: false },
      ],
      tags: ['AI', 'PyTorch', 'Vision'],
    },
  ];

  try {
    await Todo.insertMany(starterTasks);
    console.log(`✅ Starter tasks created in MongoDB for user: ${userId}`);
  } catch (err) {
    console.error('Failed to create starter tasks for user:', err.message);
  }
};
