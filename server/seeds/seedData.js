import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

export const sampleTodos = [
  {
    title: 'Robotics Lesson: Autonomous Navigation',
    description: 'Implement PID controller algorithms on the tracked robotic chassis and calibrate ultrasonic sensors for obstacle avoidance.',
    category: 'Academic',
    priority: 'High',
    status: 'In Progress',
    isCompleted: false,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    time: '19:30',
    subtasks: [
      { title: 'Calibrate gyro and wheel encoders', isCompleted: true },
      { title: 'Write PID control loop for line tracking', isCompleted: true },
      { title: 'Test obstacle detection threshold', isCompleted: false },
      { title: 'Document telemetry in lesson notebook', isCompleted: false },
    ],
    tags: ['Robotics', 'Hardware', 'Lesson'],
  },
  {
    title: 'Electronics Lesson: Sensor Circuit Assembly',
    description: 'Breadboard wiring for analog temperature and light sensors using operational amplifiers and ADC conversion.',
    category: 'Academic',
    priority: 'Medium',
    status: 'Pending',
    isCompleted: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '16:00',
    subtasks: [
      { title: 'Check component resistor values with multimeter', isCompleted: true },
      { title: 'Assemble op-amp comparator circuit', isCompleted: false },
      { title: 'Verify signal output on oscilloscope', isCompleted: false },
    ],
    tags: ['Electronics', 'Circuits', 'Hardware'],
  },
  {
    title: 'C++ Lesson: Object-Oriented Design Patterns',
    description: 'Study memory management with smart pointers (unique_ptr, shared_ptr) and implement the Factory pattern.',
    category: 'Academic',
    priority: 'High',
    status: 'Pending',
    isCompleted: false,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '17:30',
    subtasks: [
      { title: 'Read chapter 4 on RAII and move semantics', isCompleted: true },
      { title: 'Complete coding exercise for abstract factory', isCompleted: false },
      { title: 'Fix memory leaks reported by Valgrind', isCompleted: false },
    ],
    tags: ['Programming', 'C++', 'OOP'],
  },
  {
    title: 'Homework 15: Robotics Competition Bot Build',
    description: 'Finalize mechanical chassis assembly, dual-motor driver shield wiring, and wireless Bluetooth receiver module.',
    category: 'Projects',
    priority: 'Urgent',
    status: 'In Progress',
    isCompleted: false,
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    time: '14:00',
    subtasks: [
      { title: '3D print mounting brackets for servos', isCompleted: true },
      { title: 'Solder battery terminal harness', isCompleted: true },
      { title: 'Run motor stress benchmark', isCompleted: false },
    ],
    tags: ['Homework', 'Robotics', 'Project'],
  },
  {
    title: 'Homework 10: Digital Logic Simulator',
    description: 'Design 4-bit ALU circuit supporting addition, subtraction, AND, OR, and XOR operations.',
    category: 'Academic',
    priority: 'Medium',
    status: 'Completed',
    isCompleted: true,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    time: '11:00',
    subtasks: [
      { title: 'Build full adder schematic', isCompleted: true },
      { title: 'Create logic truth table verification', isCompleted: true },
      { title: 'Submit PDF report to teacher Liam Garcia', isCompleted: true },
    ],
    tags: ['Homework', 'Logic', 'Academic'],
  },
  {
    title: 'Webinar: Modern Automation Tools in Minecraft Education',
    description: 'Interactive live session covering command block scripting, MakeCode integration, and automated structure generation.',
    category: 'Personal',
    priority: 'Low',
    status: 'Pending',
    isCompleted: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: '17:00',
    subtasks: [
      { title: 'Install Minecraft Education edition client', isCompleted: true },
      { title: 'Register webinar attendee credentials', isCompleted: true },
      { title: 'Prepare questions for lecturer Jackson Lopez', isCompleted: false },
    ],
    tags: ['Webinar', 'Minecraft', 'EdTech'],
  },
  {
    title: 'Robot Fest Annual Showcase Prep',
    description: 'Prepare presentation slides, demonstration arena setup, and poster board for Robot Fest 2026.',
    category: 'Projects',
    priority: 'High',
    status: 'In Progress',
    isCompleted: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '13:00',
    subtasks: [
      { title: 'Draft booth layout layout sheet', isCompleted: true },
      { title: 'Record 2-minute demo video of chassis in action', isCompleted: false },
      { title: 'Print promotional handout cards', isCompleted: false },
    ],
    tags: ['RobotFest', 'Showcase', 'Exhibition'],
  },
  {
    title: 'Review Machine Learning Fundamentals',
    description: 'Go over linear regression, decision trees, and gradient descent optimization equations with Olivia Miller.',
    category: 'Academic',
    priority: 'Medium',
    status: 'Completed',
    isCompleted: true,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    time: '10:30',
    subtasks: [
      { title: 'Review lecture notes on loss functions', isCompleted: true },
      { title: 'Complete Jupyter notebook assignments', isCompleted: true },
    ],
    tags: ['AI', 'Math', 'Study'],
  },
];

export const seedTodos = async () => {
  try {
    await Todo.deleteMany({});
    const created = await Todo.insertMany(sampleTodos);
    console.log(`Seeded ${created.length} sample todos into MongoDB.`);
    return created;
  } catch (error) {
    console.error('Error seeding sample todos:', error);
    throw error;
  }
};
