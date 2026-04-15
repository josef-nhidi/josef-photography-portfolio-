import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Share2, ZoomIn } from 'lucide-react';

const ImageLightbox = ({ isOpen, onClose, images, currentIndex, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div 
        className="lightbox-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="lightbox-overlay" onClick={onClose} />
        
        <button className="lightbox-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="lightbox-content">
          <button className="nav-btn prev" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
            <ChevronLeft size={32} />
          </button>

          <div className="image-wrapper">
            <motion.img 
              key={currentImage.url}
              src={currentImage.url}
              alt={currentImage.title || 'Josef Nhidi Photography'}
              className="lightbox-img"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            />
            
            <motion.div 
              className="image-info-panel"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="info-main">
                <h3>{currentImage.title || 'Untitled Work'}</h3>
                <p>{currentImage.views_count || 0} Views • {currentIndex + 1} / {images.length}</p>
              </div>
              <div className="info-actions">
                <button title="Share Frame"><Share2 size={18} /></button>
                <button title="Zoom"><ZoomIn size={18} /></button>
              </div>
            </motion.div>
          </div>

          <button className="nav-btn next" onClick={(e) => { e.stopPropagation(); onNext(); }}>
            <ChevronRight size={32} />
          </button>
        </div>

        <style jsx="true">{`
          .lightbox-root {
            position: fixed;
            inset: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--glass);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
          }

          .lightbox-overlay {
            position: absolute;
            inset: 0;
            cursor: zoom-out;
          }

          .lightbox-close {
            position: absolute;
            top: 2rem;
            right: 2rem;
            z-index: 2002;
            background: var(--bg-panel);
            color: var(--primary);
            border: 1px solid var(--border);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .lightbox-close:hover {
            transform: rotate(90deg) scale(1.1);
            border-color: var(--accent);
            color: var(--accent);
          }

          .lightbox-content {
            position: relative;
            z-index: 2001;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2rem;
            pointer-events: none;
          }

          .image-wrapper {
            position: relative;
            height: 85vh;
            width: 75vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
          }

          .lightbox-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            box-shadow: 0 30px 60px rgba(0,0,0,0.3);
            border-radius: 4px;
          }

          .nav-btn {
            background: var(--bg-panel);
            border: 1px solid var(--border);
            color: var(--primary);
            width: 64px;
            height: 64px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            pointer-events: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .nav-btn:hover {
            background: var(--accent);
            color: white;
            border-color: var(--accent);
            transform: scale(1.1);
          }

          .image-info-panel {
            position: absolute;
            bottom: -5rem;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-panel);
            border: 1px solid var(--border);
            padding: 1.25rem 2rem;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 400px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          }

          .info-main h3 {
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 0.2rem;
            color: var(--primary);
          }

          .info-main p {
            font-size: 0.75rem;
            color: var(--muted);
            font-weight: 600;
          }

          .info-actions {
            display: flex;
            gap: 1rem;
          }

          .info-actions button {
            background: none;
            border: none;
            color: #777;
            cursor: pointer;
            transition: color 0.2s;
          }

          .info-actions button:hover {
            color: var(--accent);
          }

          @media (max-width: 768px) {
            .nav-btn { display: none; }
            .image-wrapper { width: 90vw; }
            .image-info-panel { min-width: 280px; bottom: -4rem; padding: 1rem; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;
