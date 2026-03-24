import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MasonryGrid from '../components/MasonryGrid';
import SEO from '../components/SEO';
import { ArrowLeft } from 'lucide-react';

const AlbumDetail = ({ settings }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await api.get(`/albums/${id}`);
        setAlbum(response.data);
      } catch (error) {
        console.error('Error fetching album:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  if (loading) return <div className="loader container">Loading...</div>;
  if (!album) return <div className="container" style={{paddingTop: '10rem'}}>Album not found.</div>;

  return (
    <section className="page" style={{ paddingTop: '4rem' }}>
      <SEO 
        settings={settings}
        title={album.name}
        description={album.description || `Explore the ${album.name} collection by Josef Nhidi. ${album.photos?.length || 0} professional frames captured in detail.`}
        image={album.photos?.[0]?.url}
        url={`/album/${id}`}
        type="article"
      />
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> <span>Back Portfolios</span>
        </button>
        
        <header className="page-header">
          <span className="header-label">Collection</span>
          <h1 className="header-title">{album.name}</h1>
          <div className="header-bg-text">ALBUM</div>
          {album.description && <p className="header-desc">{album.description}</p>}
          <span className="photo-count">{album.photos?.length || 0} Frames</span>
        </header>

        {album.photos?.length > 0 ? (
          <MasonryGrid images={album.photos} />
        ) : (
          <div className="no-images">No photos in this album yet.</div>
        )}
      </div>

      <style jsx="true">{`
        .back-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          transition: var(--transition);
          font-family: inherit;
          padding: 0;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.7rem;
          font-weight: 700;
          margin-bottom: 3rem;
        }
        .back-btn:hover { color: var(--primary); transform: translateX(-8px); }
        
        .page-header { 
          position: relative;
          margin-bottom: 8rem; 
        }
        .header-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 6px;
          color: var(--accent);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .header-title { 
          font-family: var(--font-display);
          font-size: 4.5rem; 
          line-height: 1.1;
          font-weight: 500;
          position: relative;
          z-index: 2;
          letter-spacing: -1.5px;
        }
        .header-bg-text {
          position: absolute;
          top: -1rem;
          left: -2rem;
          font-family: var(--font-display);
          font-size: 10rem;
          font-weight: 700;
          opacity: 0.03;
          z-index: 1;
          pointer-events: none;
          line-height: 0.8;
          text-transform: uppercase;
        }
        .header-desc {
          margin-top: 2rem;
          opacity: 0.6;
          max-width: 600px;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        .photo-count {
          display: inline-block;
          margin-top: 2rem;
          font-size: 0.7rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 4px;
          font-weight: 800;
          border-left: 2px solid var(--accent);
          padding-left: 1rem;
        }
        .no-images {
          padding: 5rem 0;
          text-align: center;
          opacity: 0.5;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; letter-spacing: 5px; text-transform: uppercase; font-size: 0.8rem;}
      `}</style>
    </section>
  );
};

export default AlbumDetail;
