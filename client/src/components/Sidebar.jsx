import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Award, 
  CalendarDays, 
  MessageSquare, 
  Settings, 
  LogOut,
  LogIn,
  CheckSquare
} from 'lucide-react';

export const Sidebar = ({ 
  activePage = 'dashboard', 
  onSelectPage,
  currentUser = {
    name: 'Sophia',
    role: 'Tompson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isLoggedIn: true,
  },
  onOpenAuthModal,
  onLogout
}) => {
  const handleNavClick = (pageKey, e) => {
    if (onSelectPage) {
      e.preventDefault();
      onSelectPage(pageKey);
    }
  };

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
          if (currentUser?.isLoggedIn && onSelectPage) {
            onSelectPage('settings');
          } else if (onOpenAuthModal) {
            onOpenAuthModal();
          }
        }}
        style={{ cursor: 'pointer' }}
        title={currentUser?.isLoggedIn ? 'View Student Profile' : 'Click to Log In'}
        id="sidebar-user-profile-card"
      >
        <div className="avatar-wrapper">
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
            alt={currentUser?.name || 'User'} 
            className="avatar-img"
          />
          <span className={`status-indicator ${currentUser?.isLoggedIn ? 'online' : 'offline'}`}></span>
        </div>
        <div className="user-info">
          <h4 className="user-name">{currentUser?.name?.split(' ')[0] || 'Sophia'}</h4>
          <p className="user-role">{currentUser?.role?.includes('•') ? currentUser.role.split('•')[0] : (currentUser?.name?.split(' ')[1] || 'Tompson')}</p>
        </div>
      </div>

      {/* Navigation Menu */}
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
          href="/index.html?tab=classes" 
          className={`nav-item ${activePage === 'classes' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('classes', e)}
          id="nav-classes-link"
        >
          <div className="nav-icon-box">
            <GraduationCap size={18} />
          </div>
          <span className="nav-label">My classes</span>
        </a>

        <a 
          href="/index.html?tab=grades" 
          className={`nav-item ${activePage === 'grades' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('grades', e)}
          id="nav-grades-link"
        >
          <div className="nav-icon-box">
            <Award size={18} />
          </div>
          <span className="nav-label">My grades</span>
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
          href="/index.html?tab=messages" 
          className={`nav-item ${activePage === 'messages' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('messages', e)}
          id="nav-messages-link"
        >
          <div className="nav-icon-box">
            <MessageSquare size={18} />
          </div>
          <span className="nav-label">Messages</span>
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
        {currentUser?.isLoggedIn ? (
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
