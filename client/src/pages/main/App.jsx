import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import StatGauge from '../../components/StatGauge';
import CalendarCard from '../../components/CalendarCard';
import ProjectsCard from '../../components/ProjectsCard';
import TodoCard from '../../components/TodoCard';
import TodoModal from '../../components/TodoModal';
import AuthModal from '../../components/AuthModal';
import FilterBar from '../../components/FilterBar';
import Toast from '../../components/Toast';
import ScheduleView from '../../components/ScheduleView';
import SettingsView from '../../components/SettingsView';
import { api } from '../../services/api';
import { Plus, ListTodo, LogIn } from 'lucide-react';
import '../../styles/theme.css';
import '../../styles/dashboard.css';

export function App() {
  // Active Navigation Tab State (Clean Core: dashboard, todos, schedule, settings)
  const [activeTab, setActiveTab] = useState('dashboard');

  // Real Authenticated User State from MongoDB (null if Guest)
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
    homeworkRate: 0,
    attendanceRate: 0,
    ratingScore: 0,
    upcomingSchedule: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Debounce search term by 250ms for smooth typing and immediate responsiveness
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Sync tab with URL query parameter on initial load or popstate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['dashboard', 'todos', 'schedule', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Handle Tab Switch
  const handleSelectTab = (tabKey) => {
    setActiveTab(tabKey);
    const url = new URL(window.location);
    url.searchParams.set('tab', tabKey);
    window.history.pushState({}, '', url);
  };

  // Check current session from database on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsAuthLoading(true);
        const res = await api.getMe();
        if (res.success && res.user) {
          setCurrentUser(res.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('Session check failed:', err);
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    loadTodos();
    loadStats();
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('smartech_token');
    setCurrentUser(null);
    showToast('You have been logged out. Now browsing in Guest Mode.');
    loadTodos();
    loadStats();
  };

  // Load Todos from API
  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const [field, order] = sortBy.split('-');
      const response = await api.getTodos({
        search: debouncedSearchTerm,
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
      showToast(err.message || 'Failed to load todos from database', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, statusFilter, categoryFilter, priorityFilter, sortBy]);

  // Load Stats from API
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

  // Load data on auth change or filter change
  useEffect(() => {
    loadTodos();
    loadStats();
  }, [loadTodos, loadStats, currentUser]);

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
      showToast(err.message || 'Failed to update task status in database', 'error');
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
          showToast('Task updated in database successfully!');
          setIsModalOpen(false);
          setEditingTodo(null);
          loadTodos();
          loadStats();
        }
      } else {
        // Create
        const res = await api.createTodo(todoData);
        if (res.success) {
          showToast('New task saved to database!');
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
        showToast('Task deleted from database');
        loadTodos();
        loadStats();
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Open Edit Modal
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // Render main view based on active sidebar tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <ScheduleView 
            todos={todos}
            onOpenAddModal={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
          />
        );

      case 'settings':
        return (
          <SettingsView 
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onShowToast={showToast}
          />
        );

      case 'todos':
        return (
          <div className="section-view-container">
            <div className="section-view-header">
              <div>
                <h2 className="section-main-heading">
                  {currentUser?.isLoggedIn ? `${currentUser.name}'s Tasks` : 'Task & Assignment Manager'}
                </h2>
                <p className="section-sub-heading">
                  {currentUser?.isLoggedIn 
                    ? 'Manage your personal coursework, deadlines, and milestones from database' 
                    : 'Log in to create, organize, and sync your private tasks in MongoDB'}
                </p>
              </div>

              {!currentUser?.isLoggedIn && (
                <button
                  className="btn-pill btn-primary"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <LogIn size={15} />
                  <span>Log In to Sync Tasks</span>
                </button>
              )}
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
                <p>Loading tasks from MongoDB...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="empty-state-box">
                <ListTodo size={36} className="empty-state-icon" />
                <h4 className="empty-state-title">No tasks found</h4>
                <p className="empty-state-desc">
                  {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All'
                    ? 'Try adjusting your search terms or filter criteria.'
                    : currentUser?.isLoggedIn 
                      ? 'You have no tasks in your database yet. Click below to add your first task!'
                      : 'You are in Guest mode with no tasks. Create a task or log in to sync your account!'}
                </p>
                <button
                  className="btn-pill btn-primary"
                  onClick={() => {
                    setEditingTodo(null);
                    setIsModalOpen(true);
                  }}
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
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className="dashboard-grid-layout">
            {/* Main Content Column */}
            <div className="center-content-column">
              <CalendarCard scheduleItems={stats.upcomingSchedule} />

              <ProjectsCard onFilterCategory={(cat) => {
                setCategoryFilter(cat);
                handleSelectTab('todos');
              }} />

              {/* Tasks & Assignments Section */}
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
                    <p>Loading tasks from MongoDB...</p>
                  </div>
                ) : todos.length === 0 ? (
                  <div className="empty-state-box">
                    <ListTodo size={36} className="empty-state-icon" />
                    <h4 className="empty-state-title">No tasks found</h4>
                    <p className="empty-state-desc">
                      {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All'
                        ? 'Try adjusting your search terms or filter criteria.'
                        : 'No tasks found in database. Create a new task to get started!'}
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
                attendance={stats.attendanceRate || 0}
                homework={stats.homeworkRate || 0}
                rating={stats.ratingScore || 0}
                totalTasks={stats.total}
                completedTasks={stats.completed}
              />
            </aside>
          </div>
        );
    }
  };

  const getHeaderGreeting = () => {
    if (activeTab === 'dashboard') {
      if (currentUser && currentUser.isLoggedIn) {
        const firstName = currentUser.name.trim().split(' ')[0].toUpperCase();
        return `HELLO, ${firstName}!`;
      }
      return 'GUEST DASHBOARD';
    }
    return activeTab.toUpperCase();
  };

  return (
    <div className="app-viewport">
      <div className="app-canvas">
        {/* Left Sidebar matching reference layout */}
        <Sidebar 
          activePage={activeTab} 
          onSelectPage={handleSelectTab} 
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Center & Right Content Area */}
        <main className="dashboard-main">
          {/* Header Bar with Live Functional Search */}
          <Header
            title={getHeaderGreeting()}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchResults={todos}
            onSelectTodo={handleEditTodo}
            onViewAllResults={() => handleSelectTab('todos')}
            onOpenAddModal={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
          />

          {/* Dynamic Main Body Content */}
          {renderMainContent()}
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

      {/* Login & Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
export default App;
