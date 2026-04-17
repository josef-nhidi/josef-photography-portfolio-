import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Camera,
  FolderOpen,
  User,
  Palette,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import AdminLensNav from '../components/admin/AdminLensNav';

/**
 * AdminLayout
 * High-fidelity, adaptive layout for the Josef Nhidi Admin Dashboard.
 * Now featuring the 'Admin Lens'—a mobile-native navigation pod and blade system.
 */
const AdminLayout = ({ children, activeTab, setActiveTab, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLensMode, setIsLensMode] = useState(window.innerWidth <= 1024);
  const { adminTheme, toggleAdminTheme } = useTheme();
  const navigate = useNavigate();

  // Unified Viewport Observer
  useEffect(() => {
    const handleResize = () => setIsLensMode(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply Admin Theme globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', adminTheme);
    document.body.setAttribute('data-theme', adminTheme);
  }, [adminTheme]);

  const menuItems = [
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'albums', label: 'Albums', icon: FolderOpen },
    { id: 'about', label: 'About Content', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className={`admin-layout-root ${isLensMode ? 'lens-mode' : ''}`} data-theme={adminTheme}>

      {/* ── DESKTOP SIDEBAR ── */}
      {!isLensMode && (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="admin-logo">
              <span className="logo-text">JOSEF</span>
              <span className="logo-badge">ADMIN</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-group">
              <p className="nav-eyebrow">Main</p>
              <button
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <LayoutDashboard size={18} />
                <span>Overview</span>
                {activeTab === 'overview' && <div className="active-glow" />}
              </button>
            </div>

            <div className="nav-group">
              <p className="nav-eyebrow">Content Library</p>
              {menuItems.slice(0, 2).map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {activeTab === item.id && <div className="active-glow" />}
                </button>
              ))}
            </div>

            <div className="nav-group">
              <p className="nav-eyebrow">Site Management</p>
              {menuItems.slice(2).map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {activeTab === item.id && <div className="active-glow" />}
                </button>
              ))}
            </div>
          </nav>

          <div className="sidebar-footer">
            <button className="view-site-btn" onClick={() => navigate('/')}>
              <ExternalLink size={16} />
              <span>View Portfolio</span>
            </button>
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      )}

      {/* ── MOBILE ADMIN POD ── */}
      {isLensMode && (
        <AdminLensNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <main className="main-viewport">
        {/* Top Header (Adaptive) */}
        <header className="admin-top-bar">
          <div className="header-left">
            {!isLensMode && (
              <button 
                className={`sidebar-toggle-btn ${isSidebarOpen ? 'active' : ''}`} 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <div className="breadcrumb">
              <span className="breadcrumb-root">Admin</span>
              <ChevronRight size={14} />
              <span className="active-page">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </div>
          </div>

          <div className="header-right">
            <button className="theme-toggle-btn-admin" onClick={toggleAdminTheme}>
              <motion.div
                key={adminTheme}
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
              >
                {adminTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.div>
            </button>
            <div className="user-profile">
              <div className="user-info desktop-only">
                <p className="user-name">Josef Nhidi</p>
                <p className="user-role">Administrator</p>
              </div>
              <div className="user-avatar" onClick={onLogout}>J</div>
            </div>
          </div>
        </header>

        {/* Scrollable Body (Blade Mode on Mobile) */}
        <section className={`admin-content-scroller ${isLensMode ? 'blade-view' : ''}`}>
          <div className="content-container">
            {children}
          </div>
        </section>
      </main>

      <style jsx="true">{`
        .admin-layout-root { 
          display: flex; 
          height: 100vh; 
          background: var(--admin-bg); 
          color: var(--admin-text); 
          overflow: hidden; 
          font-family: var(--font-body); 
        }
        
        .sidebar { 
          width: 260px; 
          height: 100%; 
          background: var(--admin-sidebar); 
          border-right: 1px solid var(--admin-border); 
          display: flex; 
          flex-direction: column; 
          transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1); 
          z-index: 1000; 
          flex-shrink: 0; 
          overflow: hidden;
        }
        .sidebar.closed { 
          width: 0; 
          opacity: 0; 
          visibility: hidden; 
          border-right-width: 0;
        }
        
        .sidebar-header { padding: 2rem 1.5rem; display: flex; align-items: center; }
        .admin-logo { display: flex; align-items: center; gap: 0.75rem; }
        .logo-text { font-family: var(--font-heading); font-weight: 800; font-size: 1.25rem; letter-spacing: 0.1em; color: var(--admin-text); }
        .logo-badge { font-size: 0.6rem; font-weight: 700; background: var(--admin-accent); color: white; padding: 0.2rem 0.4rem; border-radius: 4px; }

        .sidebar-nav { flex: 1; padding: 0 1rem; overflow-y: auto; }
        .nav-group { margin-bottom: 2rem; }
        .nav-eyebrow { font-size: 0.65rem; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.1em; padding-left: 0.75rem; margin-bottom: 0.75rem; }
        
        .nav-item { width: 100%; display: flex; align-items: center; gap: 0.85rem; padding: 0.75rem 0.75rem; background: transparent; border: none; color: var(--admin-text-soft); cursor: pointer; border-radius: 10px; font-size: 0.875rem; font-weight: 600; transition: all 0.2s; position: relative; margin-bottom: 0.25rem; }
        .nav-item:hover { background: var(--admin-hover-bg); color: var(--admin-text); }
        .nav-item.active { background: var(--admin-active-bg); color: var(--admin-accent); }
        .active-glow { position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; background: var(--admin-accent); border-radius: 0 4px 4px 0; box-shadow: 2px 0 10px rgba(37,99,235,0.3); }

        .sidebar-footer { padding: 1.5rem; border-top: 1px solid var(--admin-border); display: flex; flex-direction: column; gap: 0.5rem; }
        .view-site-btn, .logout-btn { width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.75rem; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .view-site-btn { background: var(--admin-hover-bg); color: var(--admin-text-soft); }
        .logout-btn { background: transparent; color: #999; }

        .main-viewport { flex: 1; display: flex; flex-direction: column; height: 100%; min-width: 0; position: relative; }
        .admin-top-bar { height: 74px; background: var(--admin-header); border-bottom: 1px solid var(--admin-border); display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; }
        .header-left { display: flex; align-items: center; gap: 1.5rem; }
        .sidebar-toggle-btn { 
          background: var(--admin-hover-bg); 
          border: 1px solid var(--admin-border); 
          color: var(--admin-text-soft); 
          width: 40px; 
          height: 40px; 
          border-radius: 10px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          z-index: 1100;
        }
        .sidebar-toggle-btn:hover { background: var(--admin-active-bg); color: var(--admin-text); border-color: var(--admin-accent); }
        .sidebar-toggle-btn.active { background: var(--admin-accent); color: white; border-color: var(--admin-accent); box-shadow: 0 4px 12px rgba(37,99,235,0.25); }

        .breadcrumb { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: #999; font-weight: 600; }
        .header-right { display: flex; align-items: center; gap: 1rem; }
        
        .theme-toggle-btn-admin { 
          background: var(--admin-hover-bg); 
          border: 1px solid var(--admin-border); 
          color: var(--admin-text-soft); 
          width: 42px; 
          height: 42px; 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .theme-toggle-btn-admin:hover { 
          background: var(--admin-active-bg);
          color: var(--admin-accent);
          border-color: var(--admin-accent);
          transform: rotate(12deg) scale(1.1);
          box-shadow: 0 5px 15px rgba(37,99,235,0.15);
        }

        .user-profile { 
          display: flex; 
          align-items: center; 
          gap: 1rem; 
          padding: 0.35rem 0.35rem 0.35rem 1rem; 
          background: var(--admin-hover-bg); 
          border: 1px solid var(--admin-border); 
          border-radius: 14px; 
          transition: all 0.2s;
        }
        .user-profile:hover {
          border-color: var(--admin-border);
          background: var(--admin-active-bg);
        }

        .user-info { text-align: right; }
        .user-name { font-size: 0.85rem; font-weight: 700; color: var(--admin-text); line-height: 1.2; }
        .user-role { font-size: 0.65rem; color: var(--admin-text-soft); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6; }

        .user-avatar { 
          width: 36px; 
          height: 36px; 
          background: var(--admin-accent); 
          border-radius: 10px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 800; 
          color: white; 
          cursor: pointer; 
          transition: all 0.2s;
        }
        .user-avatar:hover { transform: scale(1.05); }

        .admin-content-scroller { flex: 1; overflow-y: auto; padding: 2rem; background: var(--admin-bg); transition: all 0.4s; }
        .admin-content-scroller.blade-view { padding: 1rem 0; /* Full-Bleed Mobile */ }
        .content-container { max-width: 1200px; margin: 0 auto; width: 100%; }
        .admin-content-scroller.blade-view .content-container { padding: 0; }

        @media (max-width: 1024px) {
          .admin-top-bar { padding: 0 1rem; }
          .breadcrumb-root { display: none; }
          .desktop-only { display: none; }
          .user-profile { padding: 0.25rem; background: transparent; border: none; }
          .admin-content-scroller { padding-bottom: 160px; } /* Increased Space for Pod */
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
