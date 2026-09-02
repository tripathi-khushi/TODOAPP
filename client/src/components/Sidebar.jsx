import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings, 
  LogOut, 
  LogIn, 
  CheckSquare 
} from 'lucide-react';

export const Sidebar = ({ 
  activePage = 'dashboard', 
  onSelectPage,
  currentUser = null,
  onOpenAuthModal,
  onLogout
}) => {
  const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn);

  const handleNavClick = (pageKey, e) => {
    if (onSelectPage) {
      e.preventDefault();
      onSelectPage(pageKey);
    }
  };

  const displayName = isLoggedIn ? currentUser.name : 'Guest User';
  const displayRole = isLoggedIn ? (currentUser.major || 'Student') : 'Visitor';
  const avatarUrl = (isLoggedIn && currentUser.avatar) 
    ? currentUser.avatar 
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <a 
          href="/index.html" 
          className="brand-logo-link"
          onClick={(e) => handleNavClick('dashboard', e)}
        >
          <span className="brand-text">Smar<span>t</span>ech</span>
        </a>
      </div>

      {/* User Profile Card */}
      <div 
        className="user-profile-widget"
        onClick={() => {
          if (isLoggedIn && onSelectPage) {
            onSelectPage('settings');
          } else if (onOpenAuthModal) {
            onOpenAuthModal();
          }
        }}
        style={{ cursor: 'pointer' }}
        title={isLoggedIn ? 'View Profile & Settings' : 'Click to Log In'}
        id="sidebar-user-profile-card"
      >
        <div className="avatar-wrapper">
          <img 
            src={avatarUrl} 
            alt={displayName} 
            className="avatar-img"
          />
          <span className={`status-indicator ${isLoggedIn ? 'online' : 'offline'}`}></span>
        </div>
        <div className="user-info">
          <h4 className="user-name">{displayName.split(' ')[0]}</h4>
          <p className="user-role">{displayName.split(' ').slice(1).join(' ') || displayRole}</p>
        </div>
      </div>

      {/* Navigation Menu (Clean Core Essentials) */}
      <nav className="sidebar-nav">
        <a 
          href="/index.html?tab=dashboard" 
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('dashboard', e)}
          id="nav-dashboard-link"
        >
          <div className="nav-icon-box">
            <LayoutDashboard size={18} />
          </div>
          <span className="nav-label">Dashboard</span>
        </a>

        <a 
          href="/index.html?tab=todos" 
          className={`nav-item ${activePage === 'todos' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('todos', e)}
          id="nav-todos-link"
        >
          <div className="nav-icon-box">
            <CheckSquare size={18} />
          </div>
          <span className="nav-label">Todos</span>
        </a>

        <a 
          href="/index.html?tab=schedule" 
          className={`nav-item ${activePage === 'schedule' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('schedule', e)}
          id="nav-schedule-link"
        >
          <div className="nav-icon-box">
            <CalendarDays size={18} />
          </div>
          <span className="nav-label">Schedule</span>
        </a>

        <a 
          href="/index.html?tab=settings" 
          className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('settings', e)}
          id="nav-settings-link"
        >
          <div className="nav-icon-box">
            <Settings size={18} />
          </div>
          <span className="nav-label">Setting</span>
        </a>
      </nav>

      {/* Footer / Login or Logout */}
      <div className="sidebar-footer">
        {isLoggedIn ? (
          <button 
            className="logout-button" 
            onClick={onLogout}
            id="btn-logout"
            title="Log out of session"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        ) : (
          <button 
            className="login-button-sidebar btn-pill btn-primary" 
            onClick={onOpenAuthModal}
            id="btn-sidebar-login"
            style={{ width: '100%', padding: '10px' }}
          >
            <LogIn size={16} />
            <span>Log in</span>
          </button>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
