import React from 'react';
import { useNavigate } from 'react-router-dom';

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();
  const coverImage = album.photos && album.photos.length > 0 ? album.photos[0].url : null;

  return (
    <div className="album-card" onClick={() => navigate(`/album/${album.id}`)}>
      <div className="album-cover-wrapper">
        {coverImage ? (
          <img src={coverImage} alt={album.name} className="album-cover" />
        ) : (
          <div className="album-placeholder">No Photos</div>
        )}
        <div className="album-overlay">
          <span className="view-text">View Album</span>
        </div>
      </div>
      <div className="album-info">
        <h3>{album.name}</h3>
        <p>{album.photos?.length || 0} Photos</p>
      </div>

      <style jsx="true">{`
        .album-card {
          cursor: pointer;
          transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          margin-bottom: 3rem;
          position: relative;
        }
        .album-card:hover { 
          transform: translateY(-15px) scale(1.02); 
        }
        .album-cover-wrapper {
          position: relative;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          border-radius: 0;
          background: #f7f7f7;
          box-shadow: var(--shadow-md);
          transition: box-shadow 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .album-card:hover .album-cover-wrapper {
          box-shadow: var(--shadow-lg);
        }
        .album-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .album-card:hover .album-cover { transform: scale(1.05); }
        .album-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(0px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .album-card:hover .album-overlay { 
          opacity: 1; 
          backdrop-filter: blur(5px);
        }
        .view-text {
          color: white;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-weight: 700;
          font-size: 0.75rem;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.1);
        }
        .album-info {
          margin-top: 2rem;
          text-align: left;
          position: relative;
        }
        .album-info h3 {
          font-family: var(--font-display);
          font-size: 1.8rem;
          margin-bottom: 0.4rem;
          color: var(--primary);
          letter-spacing: -0.5px;
        }
        .album-info p {
          font-size: 0.7rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 700;
        }
        .album-info::before {
          content: 'ALB';
          position: absolute;
          top: -20px;
          left: -10px;
          font-family: var(--font-display);
          font-size: 3rem;
          font-style: italic;
          opacity: 0.05;
          z-index: -1;
        }
        .album-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ccc;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default AlbumCard;
