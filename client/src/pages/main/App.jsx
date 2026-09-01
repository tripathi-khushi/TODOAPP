import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import StatGauge from '../../components/StatGauge';
import CalendarCard from '../../components/CalendarCard';
import UpcomingEventsCard from '../../components/UpcomingEventsCard';
import LinkedTeachersCard from '../../components/LinkedTeachersCard';
import ProjectsCard from '../../components/ProjectsCard';
import TodoCard from '../../components/TodoCard';
import TodoModal from '../../components/TodoModal';
import FilterBar from '../../components/FilterBar';
import Toast from '../../components/Toast';
import { api } from '../../services/api';
import { Plus, ListTodo, AlertCircle, CheckCircle } from 'lucide-react';
import '../../styles/theme.css';
import '../../styles/dashboard.css';

export function App() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 75,
    homeworkRate: 90,
    attendanceRate: 60,
    ratingScore: 75,
    upcomingSchedule: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Load Todos from API
  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const [field, order] = sortBy.split('-');
      const response = await api.getTodos({
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
        sortBy: field,
        order: order,
      });

      if (response.success) {
        setTodos(response.data);
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      showToast(err.message || 'Failed to load todos', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, categoryFilter, priorityFilter, sortBy]);

  // Load Stats
  const loadStats = useCallback(async () => {
    try {
      const response = await api.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTodos();
    loadStats();
  }, [loadTodos, loadStats]);

  // Toggle Todo completion
  const handleToggleComplete = async (id, isCompleted) => {
    try {
      // Optimistic UI update
      setTodos((prev) =>
        prev.map((t) =>
          t._id === id
            ? { ...t, isCompleted, status: isCompleted ? 'Completed' : 'Pending' }
            : t
        )
      );

      const res = await api.patchTodo(id, { isCompleted });
      if (res.success) {
        loadStats();
        showToast(
          isCompleted ? 'Task marked as completed!' : 'Task marked as pending',
          'success'
        );
      }
    } catch (err) {
      console.error('Error toggling complete:', err);
      showToast(err.message || 'Failed to update task status', 'error');
      loadTodos();
    }
  };

  // Save Todo (Create / Update)
  const handleSaveTodo = async (todoData) => {
    try {
      setIsSaving(true);
      if (editingTodo && editingTodo._id) {
        // Update
        const res = await api.updateTodo(editingTodo._id, todoData);
        if (res.success) {
          showToast('Task updated successfully!');
          setIsModalOpen(false);
          setEditingTodo(null);
          loadTodos();
          loadStats();
        }
      } else {
        // Create
        const res = await api.createTodo(todoData);
        if (res.success) {
          showToast('New task created successfully!');
          setIsModalOpen(false);
          loadTodos();
          loadStats();
        }
      }
    } catch (err) {
      console.error('Error saving todo:', err);
      showToast(err.message || 'Failed to save task', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this task'}"?`)) {
      return;
    }

    try {
      const res = await api.deleteTodo(id);
      if (res.success) {
        showToast('Task deleted successfully');
        loadTodos();
        loadStats();
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Seed sample demo data
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await api.seedTodos();
      if (res.success) {
        showToast('Sample demo tasks re-seeded successfully!');
        loadTodos();
        loadStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to seed sample data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Open Edit Modal
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div className="app-viewport">
      <div className="app-canvas">
        {/* Left Sidebar matching reference layout */}
        <Sidebar activePage="dashboard" />

        {/* Center & Right Content Area */}
        <main className="dashboard-main">
          {/* Header Bar */}
          <Header
            title="HELLO, SOPHIA!"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenAddModal={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
            onSeedData={handleSeedData}
            isSeeding={isSeeding}
          />

          {/* Grid Layout (Center Content + Right Circular Gauge Column) */}
          <div className="dashboard-grid-layout">
            {/* Center Main Dashboard Content */}
            <div className="center-content-column">
              {/* Row 1: Linked Teachers + Upcoming Events (Matching Reference Top Widgets) */}
              <div className="widgets-dual-row">
                <LinkedTeachersCard />
                <UpcomingEventsCard />
              </div>

              {/* Row 2: Schedule & Calendar Card (Matching Reference "My shedule") */}
              <CalendarCard scheduleItems={stats.upcomingSchedule} />

              {/* Row 3: Projects Preview Card (Matching Reference "My projects") */}
              <ProjectsCard onFilterCategory={setCategoryFilter} />

              {/* Row 4: Dedicated Interactive Todos List Section */}
              <section className="todos-section-wrapper" id="todos-section">
                <div className="section-header-row">
                  <h3 className="section-heading">All Tasks & Assignments</h3>
                </div>

                {/* Filter and Sort Toolbar */}
                <FilterBar
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  priorityFilter={priorityFilter}
                  onPriorityChange={setPriorityFilter}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onOpenAddModal={() => {
                    setEditingTodo(null);
                    setIsModalOpen(true);
                  }}
                  totalCount={todos.length}
                />

                {/* Todos List Items */}
                {isLoading ? (
                  <div className="empty-state-box">
                    <p>Loading tasks from database...</p>
                  </div>
                ) : todos.length === 0 ? (
                  <div className="empty-state-box">
                    <ListTodo size={36} className="empty-state-icon" />
                    <h4 className="empty-state-title">No tasks found</h4>
                    <p className="empty-state-desc">
                      {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All'
                        ? 'Try adjusting your search terms or filter criteria.'
                        : 'You do not have any tasks yet. Create a new task to get started!'}
                    </p>
                    <button
                      className="btn-pill btn-primary"
                      onClick={() => {
                        setEditingTodo(null);
                        setIsModalOpen(true);
                      }}
                      id="btn-empty-add-task"
                    >
                      <Plus size={15} />
                      <span>Add New Task</span>
                    </button>
                  </div>
                ) : (
                  <div className="todos-list-container">
                    {todos.map((todo) => (
                      <TodoCard
                        key={todo._id}
                        todo={todo}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right Column: Circular Progress Metric Gauges (Attendance, Homework, Rating) */}
            <aside className="right-stats-column">
              <StatGauge
                attendance={stats.attendanceRate || 60}
                homework={stats.homeworkRate || 90}
                rating={stats.ratingScore || 75}
                totalTasks={stats.total}
                completedTasks={stats.completed}
              />
            </aside>
          </div>
        </main>
      </div>

      {/* Add / Edit Task Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        initialData={editingTodo}
        isLoading={isSaving}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
export default App;
