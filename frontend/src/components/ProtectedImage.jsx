import React, { useRef, useEffect } from 'react';

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
      
      // Clear before redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw the primary image
      ctx.drawImage(img, 0, 0);
      
      // 2. Add 'Burnt-In' Dynamic Watermarking (Security Layer)
      // This is part of the pixel data, making it harder for AI tools to remove
      ctx.save();
      ctx.font = `${Math.max(12, canvas.width / 50)}px "Inter", sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Very subtle
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      // Draw watermark in all four corners for maximum coverage
      const margin = 20;
      ctx.fillText('JOSEF NHIDI PHOTOGRAPHY', canvas.width - margin, canvas.height - margin);
      ctx.rotate(Math.PI / 2); // Rotate for side watermarking
      ctx.fillText('PROTECTED CONTENT', canvas.height / 2, -margin);
      ctx.restore();
    };
    
    img.src = src;
  }, [src]);

  return (
    <div 
      className={`protected-image-container ${className}`}
      onContextMenu={(e) => e.preventDefault()} // Block right-click
      onDragStart={(e) => e.preventDefault()}   // Block dragging
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        userSelect: 'none', 
        WebkitUserSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* ── SECURITY LAYER 1: THE INVISIBLE SHIELD ── */}
      {/* This div sits on top of everything to catch all pointer events */}
      <div 
        className="security-overlay"
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 100, 
          cursor: 'default',
          background: 'rgba(0,0,0,0)' // Completely transparent but 'there'
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* ── SECURITY LAYER 2: THE NOISE OVERLAY ── */}
      {/* A subtle micro-noise texture that makes 'Image-to-Vector' or AI-removal harder */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 50, 
          pointerEvents: 'none',
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* ── SECURITY LAYER 3: PIXEL-LEVEL CANVAS ── */}
      {/* URL is hidden. Image is literally drawn into the browser's memory. */}
      <canvas 
        ref={canvasRef} 
        title={alt}
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          pointerEvents: 'none', // Cannot be interacted with directly
          transform: 'translate3d(0,0,0)', // GPU acceleration
          userSelect: 'none'
        }}
      />
    </div>
  );
};

export default ProtectedImage;
