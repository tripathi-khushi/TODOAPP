import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Tag, AlertCircle } from 'lucide-react';

export const TodoModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date().toISOString().split('T')[0],
    time: '12:00',
    tagsInput: '',
    subtasks: [],
  });

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [error, setError] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.dueDate 
        ? new Date(initialData.dueDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Academic',
        priority: initialData.priority || 'Medium',
        status: initialData.status || (initialData.isCompleted ? 'Completed' : 'Pending'),
        dueDate: formattedDate,
        time: initialData.time || '12:00',
        tagsInput: initialData.tags ? initialData.tags.join(', ') : '',
        subtasks: initialData.subtasks ? [...initialData.subtasks] : [],
      });
    } else {
      // Default reset
      setFormData({
        title: '',
        description: '',
        category: 'Academic',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date().toISOString().split('T')[0],
        time: '12:00',
        tagsInput: '',
        subtasks: [],
      });
    }
    setError('');
    setNewSubtaskTitle('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (field === 'title' && val.trim()) {
      setError('');
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setFormData((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { title: newSubtaskTitle.trim(), isCompleted: false }],
    }));
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (idx) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== idx),
    }));
  };

  const handleToggleSubtask = (idx) => {
    setFormData((prev) => {
      const updated = [...prev.subtasks];
      updated[idx].isCompleted = !updated[idx].isCompleted;
      return { ...prev, subtasks: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter a task title');
      return;
    }

    const parsedTags = formData.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      isCompleted: formData.status === 'Completed',
      dueDate: new Date(formData.dueDate).toISOString(),
      time: formData.time,
      subtasks: formData.subtasks,
      tags: parsedTags,
    };

    onSave(payload);
  };

  const isEditing = Boolean(initialData && initialData._id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? 'Edit Task Details' : 'Create New Task'}</h3>
          <button className="btn-icon modal-close-btn" onClick={onClose} id="btn-close-modal">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="form-error-banner">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title-input">
              Task Title <span className="req-star">*</span>
            </label>
            <input
              type="text"
              id="task-title-input"
              className="form-input text-lg"
              placeholder="e.g. Robotics Lesson: PID Controller"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc-input">Description & Notes</label>
            <textarea
              id="task-desc-input"
              rows={3}
              className="form-textarea"
              placeholder="Add details, instructions, or goals for this task..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Category, Priority, Status Rows */}
          <div className="form-row-three">
            <div className="form-group">
              <label className="form-label" htmlFor="task-category-select">Category</label>
              <select
                id="task-category-select"
                className="form-select"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="Academic">Academic</option>
                <option value="Projects">Projects</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Design">Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-priority-select">Priority</label>
              <select
                id="task-priority-select"
                className="form-select"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-status-select">Status</label>
              <select
                id="task-status-select"
                className="form-select"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={13} /> Due Date
              </label>
              <input
                type="date"
                id="task-duedate-input"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={13} /> Scheduled Time
              </label>
              <input
                type="time"
                id="task-time-input"
                className="form-input"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="form-group subtasks-form-section">
            <label className="form-label">Subtasks & Milestones</label>
            <div className="subtask-add-row">
              <input
                type="text"
                className="form-input subtask-add-input"
                placeholder="Add subtask step (e.g. Solder battery harness)"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                id="modal-subtask-input"
              />
              <button
                type="button"
                className="btn-pill btn-secondary add-subtask-btn"
                onClick={handleAddSubtask}
                id="modal-add-subtask-btn"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {/* Subtask list */}
            {formData.subtasks.length > 0 && (
              <div className="modal-subtask-list">
                {formData.subtasks.map((st, idx) => (
                  <div key={idx} className="modal-subtask-item">
                    <input
                      type="checkbox"
                      checked={st.isCompleted}
                      onChange={() => handleToggleSubtask(idx)}
                      className="subtask-check"
                    />
                    <span className={`subtask-title-text ${st.isCompleted ? 'done' : ''}`}>
                      {st.title}
                    </span>
                    <button
                      type="button"
                      className="subtask-del-btn"
                      onClick={() => handleRemoveSubtask(idx)}
                      title="Remove subtask"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={13} /> Tags (comma-separated)
            </label>
            <input
              type="text"
              id="task-tags-input"
              className="form-input"
              placeholder="e.g. Robotics, Hardware, FinalProject"
              value={formData.tagsInput}
              onChange={(e) => handleInputChange('tagsInput', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-pill btn-secondary"
              onClick={onClose}
              id="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-pill btn-primary submit-task-btn"
              disabled={isLoading}
              id="modal-submit-btn"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TodoModal;
