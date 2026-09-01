import React from 'react';
import { 
  Check, 
  Calendar, 
  Clock, 
  ListChecks, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Tag
} from 'lucide-react';

export const TodoCard = ({ 
  todo, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const isCompleted = todo.isCompleted;

  // Format Due Date
  const dueDateObj = new Date(todo.dueDate);
  const formattedDate = dueDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const isToday = new Date().toDateString() === dueDateObj.toDateString();
  const isOverdue = !isCompleted && dueDateObj < new Date(new Date().setHours(0, 0, 0, 0));

  // Subtask calculation
  const totalSubtasks = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter(st => st.isCompleted).length || 0;

  return (
    <div className={`todo-item-card ${isCompleted ? 'completed' : ''} priority-${todo.priority?.toLowerCase()}`}>
      {/* Complete Checkbox */}
      <div className="todo-check-wrapper">
        <button
          type="button"
          className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(todo._id, !isCompleted);
          }}
          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
          id={`check-todo-${todo._id}`}
        >
          {isCompleted && <Check size={13} strokeWidth={3} />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="todo-content-block">
        <div className="todo-top-row">
          <h4 className={`todo-title ${isCompleted ? 'line-through' : ''}`}>
            {todo.title}
          </h4>

          {/* Badges */}
          <div className="todo-badges">
            <span className={`badge badge-${todo.priority?.toLowerCase()}`}>
              {todo.priority}
            </span>
            <span className="badge badge-category">
              {todo.category}
            </span>
          </div>
        </div>

        {todo.description && (
          <p className="todo-desc-text">
            {todo.description}
          </p>
        )}

        {/* Bottom Meta & Subtasks */}
        <div className="todo-bottom-meta">
          <div className="todo-meta-left">
            <span className={`todo-due-chip ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}`}>
              <Calendar size={12} />
              <span>{isToday ? 'Today' : formattedDate}</span>
              {todo.time && (
                <>
                  <Clock size={11} className="time-icon" />
                  <span>{todo.time}</span>
                </>
              )}
            </span>

            {totalSubtasks > 0 && (
              <span className="subtasks-chip">
                <ListChecks size={12} />
                <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
              </span>
            )}

            {todo.tags && todo.tags.length > 0 && (
              <div className="tags-list">
                {todo.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="todo-card-actions">
            <button
              className="action-icon-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
              title="Edit Task"
              id={`edit-todo-${todo._id}`}
            >
              <Edit3 size={14} />
            </button>

            <button
              className="action-icon-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo._id, todo.title);
              }}
              title="Delete Task"
              id={`delete-todo-${todo._id}`}
            >
              <Trash2 size={14} />
            </button>

            {/* MPA Standard Link to Single Todo Page */}
            <a
              href={`/todo.html?todo_id=${todo._id}`}
              className="action-icon-btn view-detail-link"
              title="Open Single Todo Page"
              id={`view-todo-${todo._id}`}
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TodoCard;
