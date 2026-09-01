import React, { useState } from 'react';
import { Search, Bell, MoreVertical, Plus, LogIn, LogOut, User, UserPlus } from 'lucide-react';

export const Header = ({ 
  searchTerm = '', 
  onSearchChange, 
  onOpenAddModal, 
  title = 'GUEST DASHBOARD',
  currentUser = null,
  onOpenAuthModal,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn);

  return (
    <header className="dashboard-header">
      {/* Greeting Title */}
      <div className="header-title-box">
        <h1 className="header-greeting">{title}</h1>
      </div>

      {/* Action Controls & Search */}
      <div className="header-actions">
        {/* Search Input */}
        <div className="search-pill-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-pill-input"
            placeholder="Search tasks, categories, tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            id="global-search-input"
          />
          {searchTerm && (
            <button 
              className="search-clear-btn" 
              onClick={() => onSearchChange && onSearchChange('')}
              title="Clear search"
            >
              ×
            </button>
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
