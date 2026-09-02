import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Check, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle, 
  Tag, 
  ListChecks,
  Layers,
  Flag,
  FileText
} from 'lucide-react';
import '../../styles/theme.css';
import '../../styles/dashboard.css';
import '../../styles/todoDetail.css';

export function TodoApp() {
  const [todoId, setTodoId] = useState(null);
  const [todo, setTodo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState(null);

  // Editable form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [tagsInput, setTagsInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // 1. Fetch user session and extract todo_id query parameter
  useEffect(() => {
    const initPage = async () => {
      try {
        const userRes = await api.getMe();
        if (userRes.success && userRes.user) {
          setCurrentUser(userRes.user);
        }
      } catch (e) {}

      const params = new URLSearchParams(window.location.search);
      const id = params.get('todo_id');

      if (!id) {
        setErrorMessage('No Todo ID provided in the URL query parameter (e.g. ?todo_id=...)');
        setIsLoading(false);
        return;
      }

      setTodoId(id);
      fetchTodoDetails(id);
    };

    initPage();
  }, []);

  // 2. Fetch specific task details
  const fetchTodoDetails = async (id) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const response = await api.getTodoById(id);

      if (response.success && response.data) {
        const item = response.data;
        setTodo(item);
        setTitle(item.title || '');
        setDescription(item.description || '');
        setCategory(item.category || 'Academic');
        setPriority(item.priority || 'Medium');
        setStatus(item.status || (item.isCompleted ? 'Completed' : 'Pending'));
        
        const dateVal = item.dueDate 
          ? new Date(item.dueDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        setDueDate(dateVal);
        setTime(item.time || '12:00');
        setTagsInput(item.tags ? item.tags.join(', ') : '');
        setSubtasks(item.subtasks ? [...item.subtasks] : []);
      }
    } catch (err) {
      console.error('Error fetching single todo:', err);
      setErrorMessage(err.message || 'Task not found or you do not have permission to view it.');
    } finally {
      setIsLoading(false);
    }
  };

  // Status Segment Click
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    const isCompleted = newStatus === 'Completed';
    try {
      if (todoId) {
        await api.patchTodo(todoId, { status: newStatus, isCompleted });
        showToast(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to quick-update status:', err);
    }
  };

  // Toggle Subtask
  const handleToggleSubtask = async (index) => {
    const updated = [...subtasks];
    const subtask = updated[index];
    subtask.isCompleted = !subtask.isCompleted;
    setSubtasks(updated);

    if (todoId && subtask._id) {
      try {
        await api.patchTodo(todoId, {
          subtaskId: subtask._id,
          subtaskCompleted: subtask.isCompleted,
        });
      } catch (err) {
        console.error('Failed to sync subtask completion:', err);
      }
    }
  };

  // Add new Subtask
  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    const newTitle = newSubtaskTitle.trim();
    setNewSubtaskTitle('');

    try {
      if (todoId) {
        const res = await api.patchTodo(todoId, {
          newSubtask: { title: newTitle },
        });
        if (res.success && res.data) {
          setSubtasks(res.data.subtasks || []);
          showToast('Subtask added');
        }
      }
    } catch (err) {
      setSubtasks((prev) => [...prev, { title: newTitle, isCompleted: false }]);
    }
  };

  // Remove Subtask
  const handleRemoveSubtask = (index) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  // Save all changes
  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      showToast('Task title cannot be empty', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status,
        isCompleted: status === 'Completed',
        dueDate: new Date(dueDate).toISOString(),
        time,
        tags: parsedTags,
        subtasks,
      };

      const res = await api.updateTodo(todoId, payload);
      if (res.success) {
        setTodo(res.data);
        showToast('All changes saved to database!');
      }
    } catch (err) {
      console.error('Error saving todo detail:', err);
      showToast(err.message || 'Failed to update task', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Todo & Return to Page 1
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      await api.deleteTodo(todoId);
      alert('Task deleted successfully from database. Returning to dashboard...');
      window.location.href = '/index.html';
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Subtask progress calculation
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((st) => st.isCompleted).length;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="app-viewport">
      <div className="app-canvas">
        {/* Left Sidebar */}
        <Sidebar activePage="todos" currentUser={currentUser} />

        {/* Center & Detail Content */}
        <main className="todo-detail-main">
          {/* Top Nav & Breadcrumbs */}
          <div className="detail-top-nav">
            <a href="/index.html" className="btn-back-link" id="btn-back-to-todos">
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </a>

            <div className="detail-breadcrumbs">
              <a href="/index.html">Dashboard</a>
              <span>/</span>
              <a href="/index.html?tab=todos">Todos</a>
              <span>/</span>
              <span>{todo?.title || 'Task Details'}</span>
            </div>
          </div>

          {/* Loading or Error State */}
          {isLoading ? (
            <div className="empty-state-box">
              <p>Fetching task details from database...</p>
            </div>
          ) : errorMessage ? (
            <div className="empty-state-box">
              <AlertCircle size={44} color="#e53e3e" />
              <h3 className="empty-state-title">Access Restricted</h3>
              <p className="empty-state-desc">{errorMessage}</p>
              <a href="/index.html" className="btn-pill btn-primary">
                Return to Dashboard
              </a>
            </div>
          ) : (
            /* Main 2-Column Detail Layout */
            <div className="detail-layout-grid">
              {/* Primary Left Editor Card */}
              <div className="detail-primary-card">
                {/* Status Segment Control */}
                <div className="detail-status-banner">
                  <div className="status-segmented-control">
                    {['Pending', 'In Progress', 'Completed'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`status-segment-btn ${
                          status === s ? `active status-${s.toLowerCase().replace(/\s+/g, '')}` : ''
                        }`}
                        onClick={() => handleStatusChange(s)}
                        id={`status-btn-${s.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="detail-badges">
                    <span className={`badge badge-${priority.toLowerCase()}`}>
                      {priority} Priority
                    </span>
                    <span className="badge badge-category">
                      {category}
                    </span>
                  </div>
                </div>

                {/* Editable Title */}
                <div className="form-group">
                  <label className="meta-field-label">
                    <FileText size={12} /> Task Title
                  </label>
                  <input
                    type="text"
                    className="detail-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title..."
                    id="detail-title-field"
                  />
                </div>

                {/* Description & Detailed Notes */}
                <div className="detail-desc-box">
                  <h4 className="detail-section-title">Description & Notes</h4>
                  <textarea
                    className="detail-desc-textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add detailed instructions, curriculum goals, or notes for this task..."
                    id="detail-desc-field"
                  />
                </div>

                {/* Interactive Subtask Manager */}
                <div className="detail-subtasks-container">
                  <div className="subtasks-header-row">
                    <h4 className="detail-section-title">
                      <ListChecks size={16} />
                      Subtasks & Milestones ({completedSubtasks}/{totalSubtasks})
                    </h4>
                    <span className="badge badge-category">{subtaskPercentage}% Complete</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="subtask-progress-bar-wrap">
                    <div 
                      className="subtask-progress-fill" 
                      style={{ width: `${subtaskPercentage}%` }}
                    />
                  </div>

                  {/* Subtask Input */}
                  <div className="subtask-add-row">
                    <input
                      type="text"
                      className="form-input subtask-add-input"
                      placeholder="Add another subtask step..."
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubtask();
                        }
                      }}
                      id="detail-new-subtask-input"
                    />
                    <button
                      type="button"
                      className="btn-pill btn-secondary"
                      onClick={handleAddSubtask}
                      id="detail-add-subtask-btn"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Subtasks List */}
                  <div className="subtask-interactive-list">
                    {subtasks.length === 0 ? (
                      <p style={{ fontSize: '0.82rem', color: '#9e8596', fontStyle: 'italic' }}>
                        No subtasks added yet. Add steps above to break down this task!
                      </p>
                    ) : (
                      subtasks.map((st, idx) => (
                        <div key={st._id || idx} className="subtask-interactive-row">
                          <button
                            type="button"
                            className={`subtask-check-circle ${st.isCompleted ? 'checked' : ''}`}
                            onClick={() => handleToggleSubtask(idx)}
                            title={st.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {st.isCompleted && <Check size={12} strokeWidth={3} />}
                          </button>
                          <span className={`subtask-text-editable ${st.isCompleted ? 'completed' : ''}`}>
                            {st.title}
                          </span>
                          <button
                            type="button"
                            className="subtask-del-btn"
                            onClick={() => handleRemoveSubtask(idx)}
                            title="Delete Subtask"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Tags Field */}
                <div className="form-group">
                  <label className="meta-field-label">
                    <Tag size={12} /> Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Robotics, AI, Assignment"
                    id="detail-tags-field"
                  />
                </div>
              </div>

              {/* Sidebar / Meta Inspector Column */}
              <div className="detail-side-column">
                <div className="meta-inspector-card">
                  <h4 className="card-title" style={{ marginBottom: '8px' }}>Task Settings</h4>

                  <div className="meta-field-row">
                    <label className="meta-field-label">
                      <Layers size={12} /> Category
                    </label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      id="detail-category-select"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Projects">Projects</option>
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Design">Design</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="meta-field-row">
                    <label className="meta-field-label">
                      <Flag size={12} /> Priority Level
                    </label>
                    <select
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      id="detail-priority-select"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="meta-field-row">
                    <label className="meta-field-label">
                      <Calendar size={12} /> Due Date
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      id="detail-duedate-input"
                    />
                  </div>

                  <div className="meta-field-row">
                    <label className="meta-field-label">
                      <Clock size={12} /> Scheduled Time
                    </label>
                    <input
                      type="time"
                      className="form-input"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      id="detail-time-input"
                    />
                  </div>

                  <div className="meta-field-row" style={{ marginTop: '8px', borderTop: '1px solid #f0e6ec', paddingTop: '12px' }}>
                    <span className="meta-field-label">Task ID (MongoDB)</span>
                    <span className="meta-id-badge">{todoId}</span>
                  </div>

                  {todo?.createdAt && (
                    <div className="meta-field-row">
                      <span className="meta-field-label">Created At</span>
                      <span style={{ fontSize: '0.78rem', color: '#7f6779' }}>
                        {new Date(todo.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {todo?.updatedAt && (
                    <div className="meta-field-row">
                      <span className="meta-field-label">Last Updated</span>
                      <span style={{ fontSize: '0.78rem', color: '#7f6779' }}>
                        {new Date(todo.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="detail-actions-panel">
                  <button
                    type="button"
                    className="btn-pill btn-save-detail"
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    id="btn-save-task-detail"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-pill btn-danger btn-delete-detail"
                    onClick={handleDelete}
                    id="btn-delete-task-detail"
                  >
                    <Trash2 size={16} />
                    <span>Delete Task</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
export default TodoApp;
