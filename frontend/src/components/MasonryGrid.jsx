import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedImage from './ProtectedImage';
import '../styles/main.css';

const MasonryGrid = ({ images }) => {
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    setShuffledImages([...images].sort(() => Math.random() - 0.5));
  }, [images]);

  // Global protection: disable right-click and common screenshot shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Block PrintScreen, Ctrl+S, Ctrl+U (view source)
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && ['s', 'S', 'u', 'U', 'p', 'P'].includes(e.key))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="masonry-container">
      {shuffledImages.map((image, index) => (
        <motion.div 
          key={image.id || index} 
          className="masonry-item"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <ProtectedImage
            src={image.url}
            alt={image.title || 'Josef Nhidi Photography'}
            className="masonry-img"
          />
        </motion.div>
      ))}

      <style jsx="true">{`
        .masonry-container {
          column-count: 3;
          column-gap: 0.5rem;
          padding: 3rem 0;
        }

        @media (max-width: 1024px) {
          .masonry-container {
            column-count: 2;
          }
        }

        @media (max-width: 600px) {
          .masonry-container {
            column-count: 1;
            column-gap: 0;
            padding: 1rem 0;
          }
        }

        .masonry-item {
          display: block;
          width: 100%;
          margin-bottom: 0.5rem;
          position: relative;
          overflow: hidden;
          background: #000;
          border-radius: 0;
          box-shadow: none;
        }

        .masonry-item img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .masonry-item:hover img {
          transform: scale(1.05);
        }

      `}</style>
    </div>
  );
};

export default MasonryGrid;
