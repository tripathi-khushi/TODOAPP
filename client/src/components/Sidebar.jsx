import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Award, 
  CalendarDays, 
  MessageSquare, 
  Settings, 
  LogOut,
  CheckSquare
} from 'lucide-react';

export const Sidebar = ({ activePage = 'dashboard', onSelectPage }) => {
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
        onClick={(e) => handleNavClick('settings', e)}
        style={{ cursor: 'pointer' }}
        title="View Student Profile"
      >
        <div className="avatar-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
            alt="Sophia Tompson" 
            className="avatar-img"
          />
          <span className="status-indicator online"></span>
        </div>
        <div className="user-info">
          <h4 className="user-name">Sophia</h4>
          <p className="user-role">Tompson</p>
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

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button 
          className="logout-button" 
          onClick={() => alert('Logged out. In a live system, this clears authentication tokens and redirects to login.')}
          id="btn-logout"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
