import React, { useRef, useEffect, useState } from 'react';
import api from '../../api/axios';

/**
 * ProtectedImage
 * A security-enhanced image component that renders pixels to a canvas.
 * This prevents standard 'Right-click Save As' and blocks most scraping tools.
 */
const ProtectedImage = ({ id, src, alt, className }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Cross-origin allowed for CDN support
    img.crossOrigin = 'Anonymous'; 
    
    img.onload = () => {
      // Scale canvas to image natural dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Clear before redraw (integrity check)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw the primary image into memory
      ctx.drawImage(img, 0, 0);
      
      // 2. Add 'Burnt-In' Dynamic Watermarking
      ctx.save();
      ctx.font = `${Math.max(12, canvas.width / 50)}px "Inter", sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'; 
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      const margin = 20;
      ctx.fillText('JOSEF NHIDI PHOTOGRAPHY', canvas.width - margin, canvas.height - margin);
      ctx.rotate(Math.PI / 2); 
      ctx.fillText('PROTECTED CONTENT', canvas.height / 2, -margin);
      ctx.restore();
    };
    
    img.src = src;
  }, [src]);

  // --- AUTOMATED VIEW TRACKING ---
  useEffect(() => {
    if (!id || tracked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Count as a view after 500ms of visibility to avoid scroll-spam
            setTimeout(() => {
              // Re-check after timeout to ensure still visible
              if (entry.isIntersecting) {
                 api.post(`photos/${id}/view`).catch(() => {});
                 setTracked(true);
              }
            }, 800);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [id, tracked]);

  return (
    <div ref={containerRef} className={`protected-image-container ${className}`}>
      {/* ── SECURITY LAYER 1: THE INVISIBLE SHIELD ── */}
      <div className="security-overlay" onContextMenu={(e) => e.preventDefault()} />

      {/* ── SECURITY LAYER 2: THE NOISE OVERLAY ── */}
      <div className="noise-overlay" />
      
      {/* ── SECURITY LAYER 3: PIXEL-LEVEL CANVAS ── */}
      <canvas 
        ref={canvasRef} 
        title={alt}
        className="pixel-canvas"
      />
    </div>
  );
};

export default ProtectedImage;
