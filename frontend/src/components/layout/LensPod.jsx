import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Camera, 
  Calendar, 
  User, 
  Sun, 
  Moon, 
  X,
  Share2,
  Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * LensPod
 * A futuristic, bottom-center floating navigation hub for mobile/tablet.
 * Morphs from a compact 'pod' into a high-fidelity holographic menu.
 */
const LensPod = ({ settings, isAdmin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { portfolioTheme, togglePortfolioTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { name: settings?.portraits_label || 'Portraits', path: '/portraits', icon: <Camera size={24} /> },
    { name: settings?.events_label || 'Events', path: '/events', icon: <Calendar size={24} /> },
    { name: settings?.about_label || 'About', path: '/about', icon: <User size={24} /> },
  ];

  const containerVariants = {
    collapsed: {
      width: 'var(--pod-size)',
      height: 'var(--pod-size)',
      borderRadius: '50%',
      bottom: '1.5rem',
      right: '1.5rem',
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    expanded: {
      width: 'calc(100vw - 3rem)',
      height: 'auto',
      borderRadius: '24px',
      bottom: '1.5rem',
      right: '1.5rem',
      transition: { type: 'spring', damping: 20, stiffness: 200 }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="lens-interface">
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="lens-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className={`lens-pod-container ${isExpanded ? 'active' : ''}`}
        variants={containerVariants}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        layout
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button 
              key="pod-trigger"
              className="pod-trigger"
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layoutId="bubble"
            >
              <div className="pod-inner">
                <div className="pod-rings"></div>
                <div className="pod-dot"></div>
              </div>
            </motion.button>
          ) : (
            <motion.div 
              key="pod-menu"
              className="pod-menu-content"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="pod-menu-header">
                <span className="pod-brand">
                  {(settings?.logo_text || 'JOSEF').split(' ')[0]}
                </span>
                <button className="pod-close" onClick={() => setIsExpanded(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="pod-links-grid">
                {menuItems.map((item) => (
                  <motion.div key={item.path} variants={itemVariants}>
                    <Link 
                      to={item.path} 
                      className={`pod-link ${location.pathname === item.path ? 'active' : ''}`}
                      onClick={() => setIsExpanded(false)}
                    >
                      <span className="pod-link-icon">{item.icon}</span>
                      <span className="pod-link-name">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="pod-menu-footer">
                <button className="pod-action-btn" onClick={togglePortfolioTheme}>
                  {portfolioTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  <span>{portfolioTheme === 'light' ? 'Dark' : 'Light'}</span>
                </button>
                
                {isAdmin && (
                  <Link to="/admin/dashboard" className="pod-action-btn" onClick={() => setIsExpanded(false)}>
                    <Settings size={18} />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx="true">{`
        .lens-interface {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2000;
        }

        .lens-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          pointer-events: auto;
        }

        .lens-pod-container {
          position: absolute;
          background: var(--lens-glass, rgba(0,0,0,0.85));
          backdrop-filter: blur(var(--lens-blur, 30px));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05);
          pointer-events: auto;
          overflow: hidden;
        }

        .pod-trigger {
          width: 100%;
          height: 100%;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .pod-inner {
          position: relative;
          width: 24px;
          height: 24px;
        }

        .pod-rings {
          position: absolute;
          inset: -4px;
          border: 2px solid var(--accent);
          border-radius: 50%;
          opacity: 0.3;
          animation: podPulse 2s infinite cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .pod-dot {
          position: absolute;
          inset: 4px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--accent);
        }

        @keyframes podPulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .pod-menu-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .pod-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pod-brand {
          font-family: var(--font-heading);
          font-weight: 800;
          letter-spacing: 0.1em;
          color: white;
          font-size: 1rem;
        }

        .pod-close {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .pod-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .pod-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 0.5rem;
          border-radius: 16px;
          color: rgba(255,255,255,0.6);
          transition: all 0.3s;
        }

        .pod-link-icon {
          color: white;
          opacity: 0.8;
          transition: all 0.3s;
        }

        .pod-link:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .pod-link.active {
          background: rgba(37, 99, 235, 0.2);
          color: var(--accent);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.1);
        }

        .pod-link.active .pod-link-icon {
          color: var(--accent);
          opacity: 1;
        }

        .pod-link-name {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .pod-menu-footer {
          display: flex;
          gap: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1rem;
        }

        .pod-action-btn {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: none;
          color: white;
          padding: 0.75rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pod-action-btn:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default LensPod;
