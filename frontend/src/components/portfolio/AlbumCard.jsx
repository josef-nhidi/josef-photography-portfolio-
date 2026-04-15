import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'lucide-react';

/**
 * AlbumCard
 * Renders a preview card for a photography collection.
 * Displays the cover image, asset count, and handles navigation.
 */
const AlbumCard = ({ album }) => {
  const navigate = useNavigate();
  const coverImage = album.photos && album.photos.length > 0 ? album.photos[0].url : null;

  return (
    <div className="album-panel-card" onClick={() => navigate(`/album/${album.id}`)}>
      <div className="album-cover-container">
        {coverImage ? (
          <img src={coverImage} alt={album.name} className="album-cover" />
        ) : (
          <div className="album-placeholder">
             <Image size={32} />
             <span>No Content</span>
          </div>
        )}
        <div className="album-badge">Collection</div>
      </div>
      
      <div className="album-card-content">
        <h3 className="album-title">{album.name}</h3>
        <div className="album-meta">
           <Image size={14} className="meta-icon" />
           <span>{album.photos?.length || 0} Assets</span>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
