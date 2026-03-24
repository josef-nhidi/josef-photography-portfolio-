import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Linkedin, Mail } from 'lucide-react';
import '../styles/main.css';

const Navbar = ({ settings, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: settings?.portraits_label || 'Portraits', path: '/portraits' },
    { name: settings?.events_label || 'Events', path: '/events' },
    { name: settings?.about_label || 'About', path: '/about' },
  ];

  return (
    <>
      <div className="mobile-header">
        <Link to="/" className="sidebar-logo-text-mobile">
          {settings?.logo_text || 'JOSEF NHIDI'}
        </Link>
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <Link to="/" className="sidebar-brand">
            <div className="sidebar-logo-text">
              {settings?.logo_text || 'JOSEF NHIDI'}
            </div>
          </Link>
          
          <nav className="sidebar-nav">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={location.pathname === link.path ? 'active-link' : ''}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
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
              <Link to="/admin/dashboard" className="admin-link">Admin Dashboard</Link>
            )}
          </div>
        </div>
      </aside>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

      <style jsx="true">{`
        .mobile-header {
          display: none;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: var(--glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 900;
          border-bottom: 1px solid var(--glass-border);
        }

        .mobile-toggle {
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
        }

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

        .sidebar-logo-text {
          font-family: var(--font-display);
          font-size: 2.2rem; /* Adjusted for purely textual logo */
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 0.9;
          color: var(--primary);
          transition: transform 0.3s ease;
          word-wrap: break-word; /* Allows long custom names to wrap cleanly */
        }
        
        .sidebar-logo-text-mobile {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -1px;
          color: var(--primary);
          text-decoration: none;
        }

        .sidebar-brand:hover .sidebar-logo-text {
          transform: scale(1.05); /* Give the text the hover effect the monogram had */
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2.8rem;
          flex: 1;
        }

        .sidebar-nav a {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 5px;
          color: var(--muted);
          font-weight: 700;
          position: relative;
          width: fit-content;
          transition: var(--transition);
        }

        .sidebar-nav a::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: -10px;
          left: 0;
          background-color: var(--accent);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .sidebar-nav a:hover, .sidebar-nav a.active-link {
          color: var(--primary);
          transform: translateX(10px);
        }

        .sidebar-nav a.active-link::after, .sidebar-nav a:hover::after {
          transform: scaleX(1);
          transform-origin: left;
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
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--muted);
          transition: var(--transition);
          display: inline-block;
        }

        .admin-link:hover {
          color: var(--accent);
          transform: translateY(-2px);
        }

        .overlay {
          display: none;
        }

        @media (max-width: 1024px) {
          .sidebar { width: 280px; }
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }
          
          .sidebar {
            top: 0; left: 0;
            width: 85%;
            height: 100vh;
            border-radius: 0;
            transform: translateX(-100%);
            border: none;
            border-right: 1px solid var(--glass-border);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            z-index: 950;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
