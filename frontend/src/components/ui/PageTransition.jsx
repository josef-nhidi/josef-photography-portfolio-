import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in:      { opacity: 1, y: 0 },
  out:     { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: [0.23, 1, 0.32, 1], // Quartz Ease (Snappy)
  duration: 0.2,
};

const PageTransition = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    style={{ width: '100%' }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
