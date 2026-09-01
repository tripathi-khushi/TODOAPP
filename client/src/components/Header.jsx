import React, { useState } from 'react';
import { Search, Bell, MoreVertical, Plus, Sparkles } from 'lucide-react';

export const Header = ({ 
  searchTerm = '', 
  onSearchChange, 
  onOpenAddModal, 
  onSeedData,
  isSeeding = false,
  title = 'HELLO, SOPHIA!'
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

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

        {/* More Options */}
        <button className="btn-icon more-options-btn" id="btn-more-options">
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
};
export default Header;
