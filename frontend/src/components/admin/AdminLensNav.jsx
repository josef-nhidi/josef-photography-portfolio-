import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Camera, 
  FolderOpen, 
  User, 
  Palette, 
  ShieldCheck, 
  Plus,
  X,
  Menu
} from 'lucide-react';

/**
 * AdminLensNav
 * The mobile-native navigation engine for the Josef Nhidi Admin Dashboard.
 * Designed as a bottom-anchored 'Liquid Pod' for perfect ergonomic reach.
 */
const AdminLensNav = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'albums', label: 'Albums', icon: FolderOpen },
    { id: 'about', label: 'About', icon: User },
    { id: 'appearance', label: 'Design', icon: Palette },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="admin-lens-nav-container">
      {/* ── LIQUID MENU EXPANSION ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="admin-lens-menu"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="admin-menu-grid">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`admin-menu-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="admin-item-icon">
                    <item.icon size={22} />
                  </div>
                  <span className="admin-item-label">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── THE PRIMARY POD ── */}
      <motion.div 
        className="admin-lens-pod"
        whileTap={{ scale: 0.9 }}
      >
        <button 
          className={`pod-main-btn ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      <style jsx="true">{`
        .admin-lens-nav-container {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          pointer-events: none;
        }

        .admin-lens-pod {
          pointer-events: auto;
          background: var(--admin-accent, #2563eb);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
          border: 4px solid var(--admin-panel, white);
        }

        .pod-main-btn {
          background: none;
          border: none;
          color: white;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .admin-lens-menu {
          pointer-events: auto;
          background: var(--admin-panel, white);
          border: 1px solid var(--admin-border);
          padding: 1.5rem;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          backdrop-filter: blur(12px);
          width: calc(100vw - 3rem);
          max-width: 360px;
        }

        .admin-menu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .admin-menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          padding: 0.75rem;
          border-radius: 16px;
          transition: all 0.2s;
          color: var(--admin-text-soft);
        }

        .admin-menu-item.active {
          background: var(--admin-active-bg);
          color: var(--admin-accent);
        }

        .admin-item-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--admin-hover-bg);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .admin-menu-item.active .admin-item-icon {
          background: var(--admin-accent);
          color: white;
        }

        .admin-item-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (min-width: 1025px) {
          .admin-lens-nav-container { display: none; }
        }
      `}</style>
    </div>
  );
};

export default AdminLensNav;
