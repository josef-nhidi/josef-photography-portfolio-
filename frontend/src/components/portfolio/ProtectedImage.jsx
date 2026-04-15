import React, { useRef, useEffect } from 'react';

/**
 * ProtectedImage
 * A security-enhanced image component that renders pixels to a canvas.
 * This prevents standard 'Right-click Save As' and blocks most scraping tools.
 */
const ProtectedImage = ({ src, alt, className }) => {
  const canvasRef = useRef(null);

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

  return (
    <div className={`protected-image-container ${className}`}>
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
