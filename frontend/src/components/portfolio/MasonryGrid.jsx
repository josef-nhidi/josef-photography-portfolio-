import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedImage from './ProtectedImage';

/**
 * MasonryGrid
 * Renders a collection of images in a highly-responsive masonry layout.
 * Optimized for cinematic presentation and fast entrance animations.
 */
const MasonryGrid = ({ images }) => {
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    // Shuffling creates a dynamic, gallery-like feel on every visit
    setShuffledImages([...images].sort(() => Math.random() - 0.5));
  }, [images]);

  return (
    <div className="masonry-container">
      {shuffledImages.map((image, index) => (
        <motion.div 
          key={image.id || index} 
          className="masonry-item"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: (index % 5) * 0.1 }}
        >
          <ProtectedImage
            id={image.id}
            src={image.url}
            alt={image.title ? `${image.title} | Josef Nhidi Photographer Tunisia` : 'Josef Nhidi Photographer Tunisia - Professional Services'}
            className="masonry-img"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MasonryGrid;
