import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Subtask title is required'],
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Academic', 'Personal', 'Work', 'Projects', 'Design', 'Other'],
      default: 'Academic',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    time: {
      type: String,
      default: '12:00',
    },
    subtasks: [SubtaskSchema],
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook to keep status and isCompleted in sync
TodoSchema.pre('save', function (next) {
  if (this.isModified('isCompleted')) {
    if (this.isCompleted && this.status !== 'Completed') {
      this.status = 'Completed';
    } else if (!this.isCompleted && this.status === 'Completed') {
      this.status = 'Pending';
    }
  } else if (this.isModified('status')) {
    this.isCompleted = this.status === 'Completed';
  }
  next();
});

// Virtual for subtask progress calculation
TodoSchema.virtual('subtaskProgress').get(function () {
  if (!this.subtasks || this.subtasks.length === 0) return 0;
  const completed = this.subtasks.filter((st) => st.isCompleted).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

const Todo = mongoose.model('Todo', TodoSchema);
export default Todo;
