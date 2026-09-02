import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  MoreVertical, 
  Plus, 
  LogIn, 
  LogOut, 
  User, 
  UserPlus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const Header = ({ 
  searchTerm = '', 
  onSearchChange, 
  onOpenAddModal, 
  title = 'GUEST DASHBOARD',
  currentUser = null,
  onOpenAuthModal,
  onLogout,
  searchResults = [],
  onSelectTodo,
  onViewAllResults
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchContainerRef = useRef(null);
  const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onViewAllResults) {
        setIsSearchFocused(false);
        onViewAllResults();
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const showDropdown = isSearchFocused && searchTerm.trim().length > 0;

  return (
    <header className="dashboard-header">
      {/* Greeting Title */}
      <div className="header-title-box">
        <h1 className="header-greeting">{title}</h1>
      </div>

      {/* Action Controls & Search */}
      <div className="header-actions">
        {/* Search Input Container */}
        <div className="search-wrapper-relative" ref={searchContainerRef}>
          <div className="search-pill-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-pill-input"
              placeholder="Search tasks, tags, categories..."
              value={searchTerm}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
              id="global-search-input"
              autoComplete="off"
            />
            {searchTerm && (
              <button 
                type="button"
                className="search-clear-btn" 
                onClick={() => {
                  if (onSearchChange) onSearchChange('');
                  setIsSearchFocused(false);
                }}
                title="Clear search"
                id="btn-clear-search"
              >
                ×
              </button>
            )}
          </div>

          {/* Floating Search Dropdown */}
          {showDropdown && (
            <div className="search-dropdown-results" id="search-dropdown-popup">
              <div className="search-dropdown-header">
                <span>Matching Tasks ({searchResults.length})</span>
                <span style={{ fontSize: '0.7rem', color: '#a28c9b' }}>Press Enter to view all</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="search-no-results">
                  <p>No tasks matching <strong>"{searchTerm}"</strong></p>
                  <p style={{ fontSize: '0.76rem', color: '#9c8194', marginTop: '4px' }}>
                    Try searching by title, category, priority, or tags
                  </p>
                </div>
              ) : (
                <>
                  <ul className="search-results-list">
                    {searchResults.slice(0, 5).map((todo) => {
                      const isDone = todo.isCompleted;
                      const statusClass = isDone ? 'completed' : todo.status === 'In Progress' ? 'inprogress' : 'pending';
                      const formattedDate = todo.dueDate 
                        ? new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '';

                      return (
                        <li 
                          key={todo._id} 
                          className="search-result-item"
                          onClick={() => {
                            setIsSearchFocused(false);
                            if (onSelectTodo) onSelectTodo(todo);
                          }}
                          id={`search-item-${todo._id}`}
                        >
                          <div className="search-result-left">
                            <span className={`search-status-dot ${statusClass}`}></span>
                            <div className="search-result-title-col">
                              <span className="search-result-title">{todo.title}</span>
                              <div className="search-result-meta">
                                <span className={`badge badge-${todo.priority?.toLowerCase() || 'medium'}`} style={{ fontSize: '0.66rem', padding: '2px 6px' }}>
                                  {todo.priority || 'Medium'}
                                </span>
                                <span>•</span>
                                <span>{todo.category || 'General'}</span>
                                {formattedDate && (
                                  <>
                                    <span>•</span>
                                    <span>{formattedDate}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <a 
                            href={`/todo.html?todo_id=${todo._id}`}
                            className="pill-link-btn"
                            title="Open in Todo page"
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '26px', height: '26px' }}
                          >
                            <ExternalLink size={12} />
                          </a>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="search-dropdown-footer">
                    <button
                      type="button"
                      className="search-view-all-btn"
                      onClick={() => {
                        setIsSearchFocused(false);
                        if (onViewAllResults) onViewAllResults();
                      }}
                      id="btn-search-view-all"
                    >
                      <span>View all {searchResults.length} matching tasks</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* New Task Button */}
        {onOpenAddModal && (
          <button 
            className="btn-pill btn-primary add-task-top-btn"
            onClick={onOpenAddModal}
            id="btn-open-add-modal"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="notification-wrapper">
          <button 
            className="btn-icon notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            id="btn-notifications"
          >
            <Bell size={18} />
            {isLoggedIn && <span className="notification-badge-dot"></span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h5>Notifications</h5>
                <span>{isLoggedIn ? 'Live' : 'Guest'}</span>
              </div>
              <ul className="notification-list">
                {isLoggedIn ? (
                  <>
                    <li>
                      Welcome to your personal dashboard, <strong>{currentUser.name}</strong>.
                      <span className="notif-time">Just now</span>
                    </li>
                    <li>
                      Your coursework and tasks are persistently saved in MongoDB.
                      <span className="notif-time">1m ago</span>
                    </li>
                  </>
                ) : (
                  <li>
                    You are browsing as a guest. Please log in to sync your tasks and grades.
                    <span className="notif-time">Info</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Login or User Badge Button */}
        {isLoggedIn ? (
          <div className="header-user-dropdown-wrap" style={{ position: 'relative' }}>
            <button
              className="btn-pill btn-secondary header-user-badge-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              id="btn-header-user-menu"
              title="Account Options"
            >
              <User size={15} />
              <span>{currentUser.name.split(' ')[0]}</span>
            </button>

            {showUserMenu && (
              <div className="notification-dropdown user-menu-dropdown" style={{ width: '220px' }}>
                <div style={{ padding: '6px 0', borderBottom: '1px solid #f0e6ec', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.88rem', display: 'block' }}>{currentUser.name}</strong>
                  <span style={{ fontSize: '0.74rem', color: '#7f6779', wordBreak: 'break-all' }}>{currentUser.email}</span>
                </div>
                <button
                  className="dropdown-menu-item"
                  onClick={() => { setShowUserMenu(false); onOpenAuthModal && onOpenAuthModal(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 4px', fontSize: '0.82rem', color: '#624b5d', fontWeight: 600 }}
                >
                  <UserPlus size={14} />
                  <span>Switch Account</span>
                </button>
                <button
                  className="dropdown-menu-item"
                  onClick={() => { setShowUserMenu(false); onLogout && onLogout(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 4px', fontSize: '0.82rem', color: '#c5221f', fontWeight: 600 }}
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn-pill btn-primary header-login-btn"
            onClick={onOpenAuthModal}
            id="btn-header-login"
            title="Log in to your account"
          >
            <LogIn size={16} />
            <span>Log In</span>
          </button>
        )}

        {/* More Options */}
        <button 
          className="btn-icon more-options-btn" 
          id="btn-more-options"
          onClick={() => {
            if (isLoggedIn) {
              setShowUserMenu(!showUserMenu);
            } else if (onOpenAuthModal) {
              onOpenAuthModal();
            }
          }}
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
};
export default Header;
