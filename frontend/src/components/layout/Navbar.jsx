import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Instagram, Linkedin, Mail, 
  Camera, Calendar, User, Sun, Moon 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import LensPod from './LensPod';
import '../../styles/main.css';

/**
 * Navbar
 * A dual-mode navigation component.
 * Desktop: A sophisticated, glassmorphic sidebar.
 * Mobile/Tablet: A futuristic 'Lens Pod' floating navigation hub.
 */
const Navbar = ({ settings, isAdmin }) => {
  const [isLensMode, setIsLensMode] = useState(window.innerWidth <= 1024);
  const { portfolioTheme, togglePortfolioTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsLensMode(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply Portfolio Theme globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', portfolioTheme);
    document.body.setAttribute('data-theme', portfolioTheme);
  }, [portfolioTheme]);

  const navGroups = [
    {
      title: 'Gallery',
      links: [
        { name: 'Portraits', path: '/portraits', icon: <Camera size={18} /> },
        { name: 'Events', path: '/events', icon: <Calendar size={18} /> },
      ]
    },
    {
      title: 'Studio',
      links: [
        { name: settings?.about_label || 'About', path: '/about', icon: <User size={18} /> },
      ]
    }
  ];

  return (
    <>
      {/* ── LENS POD (Mobile/Tablet Viewports) ── */}
      {isLensMode && <LensPod settings={settings} isAdmin={isAdmin} />}

      {/* ── SIDEBAR (Desktop Viewports) ── */}
      {!isLensMode && (
        <aside className="sidebar">
          <div className="sidebar-content">
            <Link to="/portraits" className="sidebar-brand">
              <div className="sidebar-logo">
                <div className="logo-icon">
                  <div className="icon-frame"></div>
                  <div className="icon-dot"></div>
                </div>
                <div className="logo-text-group">
                  <div className="logo-main">
                    <span className="logo-first">JOSEF</span>
                    <div className="logo-divider"></div>
                    <span className="logo-type">NHIDI</span>
                  </div>
                  <span className="logo-tagline">PHOTOGRAPHER</span>
                </div>
              </div>
            </Link>
            
            <nav className="sidebar-nav">
              {navGroups.map((group, idx) => (
                <div key={idx} className="nav-group">
                  <span className="nav-eyebrow">{group.title}</span>
                  <div className="nav-links">
                    {group.links.map((link) => (
                      <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                      >
                        <span className="link-icon">{link.icon}</span>
                        <span className="link-text">{link.name}</span>
                        {location.pathname === link.path && <div className="active-indicator" />}
                      </Link>
                    ))}
                    {group.title === 'Studio' && (
                      <button 
                        className="nav-link theme-toggle-nav" 
                        onClick={togglePortfolioTheme}
                        title={`Switch to ${portfolioTheme === 'light' ? 'Dark' : 'Light'} Mode`}
                      >
                        <span className="link-icon">
                          {portfolioTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </span>
                        <span className="link-text">
                          {portfolioTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </nav>
            
            <div className="sidebar-footer">
              <div className="sidebar-socials">
                {settings?.instagram_url ? (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" title="Instagram">
                    <Instagram size={18} />
                  </a>
                ) : (
                  <a href="https://instagram.com/josef_nhidi" target="_blank" rel="noopener noreferrer" title="Instagram">
                    <Instagram size={18} />
                  </a>
                )}
                <a href="https://www.linkedin.com/in/youssef-nhidi/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <Linkedin size={18} />
                </a>
                {settings?.email ? (
                  <a href={`mailto:${settings.email}`} title="Email">
                    <Mail size={18} />
                  </a>
                ) : (
                  <a href="mailto:nhidiyoussef8@gmail.com" title="Email">
                    <Mail size={18} />
                  </a>
                )}
              </div>
              {isAdmin && (
                <Link to="/admin/dashboard" className="admin-link">Manage Studio</Link>
              )}
            </div>
          </div>
        </aside>
      )}

      <style jsx="true">{`
        .sidebar {
          width: 320px;
          height: calc(100vh - 40px);
          position: fixed;
          top: 20px;
          left: 20px;
          background: var(--glass);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          z-index: 1000;
          box-shadow: var(--shadow-md);
          transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 5.5rem 4rem;
        }

        .sidebar-brand {
          display: flex;
          flex-direction: column;
          margin-bottom: 6rem;
          text-decoration: none;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .logo-icon {
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-frame {
          position: absolute;
          inset: 0;
          border: 2px solid var(--primary);
          border-radius: 6px;
          opacity: 0.15;
          transition: var(--transition);
        }

        .icon-dot {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
          transition: var(--transition);
        }

        .logo-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .logo-main {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-first {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--primary);
          text-transform: uppercase;
        }

        .logo-divider {
          width: 1px;
          height: 14px;
          background: #ddd;
        }

        .logo-type {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: var(--muted);
          text-transform: uppercase;
        }

        .logo-tagline {
          font-family: var(--font-body);
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.4em;
          color: var(--accent);
          text-transform: uppercase;
          opacity: 0.8;
        }

        .sidebar-brand:hover .icon-frame {
          opacity: 0.6;
          border-color: var(--accent);
          transform: rotate(45deg);
        }

        .sidebar-brand:hover .icon-dot {
          transform: scale(1.5);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.6);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          flex: 1;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .nav-eyebrow {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #bbb;
          font-weight: 800;
          padding-left: 1rem;
          margin-bottom: 0.25rem;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--muted);
          font-weight: 700;
          border-radius: 12px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        .nav-link:hover {
          color: var(--primary);
          background: rgba(0, 0, 0, 0.02);
        }

        .nav-link:hover .link-icon { opacity: 1; }

        .nav-link.active {
          color: var(--accent);
          background: rgba(37, 99, 235, 0.04);
        }

        .nav-link.active .link-icon {
          color: var(--accent);
          opacity: 1;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 25%;
          height: 50%;
          width: 3px;
          background: var(--accent);
          border-radius: 0 4px 4px 0;
          box-shadow: 2px 0 8px rgba(37, 99, 235, 0.3);
        }

        .theme-toggle-nav {
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
          margin-top: 0.5rem;
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sidebar-socials {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .sidebar-socials a {
          color: var(--muted);
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-socials a:hover {
          color: var(--accent);
          transform: translateY(-3px);
        }
        
        .admin-link {
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 800;
          color: var(--accent);
          transition: var(--transition);
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        .admin-link:hover {
          opacity: 0.7;
          transform: translateX(5px);
        }
      `}</style>
    </>
  );
};

export default Navbar;
