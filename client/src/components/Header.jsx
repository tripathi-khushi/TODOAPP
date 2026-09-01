import React, { useState } from 'react';
import { Search, Bell, MoreVertical, Plus, Sparkles, LogIn, LogOut, User } from 'lucide-react';

export const Header = ({ 
  searchTerm = '', 
  onSearchChange, 
  onOpenAddModal, 
  onSeedData,
  isSeeding = false,
  title = 'HELLO, SOPHIA!',
  currentUser = { name: 'Sophia Tompson', isLoggedIn: true },
  onOpenAuthModal,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

        {/* Seed Data Button */}
        {onSeedData && (
          <button
            className="btn-icon seed-btn"
            onClick={onSeedData}
            title="Reset / Seed Demo Data"
            disabled={isSeeding}
            id="btn-seed-data"
          >
            <Sparkles size={16} className={isSeeding ? 'animate-spin' : ''} />
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
            <span className="notification-badge-dot"></span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h5>Notifications</h5>
                <span>3 New</span>
              </div>
              <ul className="notification-list">
                <li>
                  <strong>Robotics Lesson</strong> is scheduled for today at 19:30.
                  <span className="notif-time">10m ago</span>
                </li>
                <li>
                  <strong>Homework 10</strong> was submitted and marked complete.
                  <span className="notif-time">2h ago</span>
                </li>
                <li>
                  Liam Garcia scheduled an <strong>Electronics Lesson</strong> for tomorrow.
                  <span className="notif-time">1d ago</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Prominent Login / User Status Button */}
        {currentUser?.isLoggedIn ? (
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
              <div className="notification-dropdown user-menu-dropdown" style={{ width: '200px' }}>
                <div style={{ padding: '4px 0', borderBottom: '1px solid #f0e6ec', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.88rem', display: 'block' }}>{currentUser.name}</strong>
                  <span style={{ fontSize: '0.74rem', color: '#7f6779' }}>{currentUser.email || 'sophia@smartech.edu'}</span>
                </div>
                <button
                  className="dropdown-menu-item"
                  onClick={() => { setShowUserMenu(false); onOpenAuthModal && onOpenAuthModal(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 4px', fontSize: '0.82rem', color: '#624b5d', fontWeight: 600 }}
                >
                  <User size={14} />
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
            if (currentUser?.isLoggedIn) {
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
