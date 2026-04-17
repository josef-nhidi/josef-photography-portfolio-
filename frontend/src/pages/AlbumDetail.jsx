import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MasonryGrid from '../components/portfolio/MasonryGrid';
import SEO from '../components/ui/SEO';
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

  if (loading) return (
    <div className="loader-page">
      <div className="aperture-pulse"></div>
      <span className="loader-sub">Refining Collection</span>
    </div>
  );
  if (!album) return <div className="container" style={{paddingTop: '10rem'}}>Album not found.</div>;

  return (
    <section className="page" style={{ paddingTop: '4rem' }}>
      <SEO 
        settings={settings}
        title={album.name}
        description={album.description || `Discover the ${album.name} collection by Josef Nhidi. Featuring ${album.photos?.length || 0} high-end professional frames captured with a cinematic lens and unique artistic vision.`}
        image={album.photos?.[0]?.url}
        url={`/album/${id}`}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": `${album.name} | Josef Nhidi Photography`,
          "description": album.description || `A professional photography collection featuring ${album.photos?.length || 0} images.`,
          "author": {
            "@type": "Person",
            "name": "Josef Nhidi"
          },
          "image": album.photos?.[0]?.url,
          "numberOfItems": album.photos?.length || 0
        }}
      />
      <div className="container">
        <header className="page-header">
          <div className="header-content">
            <span className="header-label">Selected Collection</span>
            <h1 className="header-title">{album.name}</h1>
            {album.description && <p className="header-subtitle">{album.description}</p>}
          </div>
          <div className="header-bg-text">ALBUM</div>
        </header>

        <div className="portfolio-content-panel">
          <div className="panel-toolbar detail-toolbar">
            <button className="back-btn-modern" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              <span>Portfolios</span>
            </button>
            <div className="toolbar-divider" />
            <span className="toolbar-stat">{album.photos?.length || 0} Professional Frames</span>
          </div>

          <div className="panel-body">

            {album.photos?.length > 0 ? (
              <MasonryGrid images={album.photos} />
            ) : (
              <div className="no-images">No photos in this album yet.</div>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .page-header { position: relative; margin-bottom: 4rem; }
        .header-content { position: relative; z-index: 5; }
        .header-subtitle { font-size: 1rem; color: var(--admin-text-soft); margin-top: 1rem; max-width: 600px; line-height: 1.6; opacity: 0.8; }

        .portfolio-content-panel { 
          background: var(--bg-panel); 
          border: 1px solid var(--border); 
          border-radius: 20px; 
          overflow: hidden; 
          margin-bottom: 4rem;
          box-shadow: var(--shadow-premium);
        }
        
        .panel-toolbar { 
          padding: 1.25rem 2rem; 
          border-bottom: 1px solid var(--border-subtle); 
          background: var(--admin-header);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .back-btn-modern {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg);
          border: 1px solid var(--border);
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          transition: all 0.3s ease;
        }

        .back-btn-modern:hover {
          color: var(--primary);
          border-color: var(--accent);
          background: var(--bg-panel);
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .toolbar-divider { height: 20px; width: 1px; background: var(--border-subtle); }
        .toolbar-stat { font-size: 0.7rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.2em; }
        
        .panel-body { padding: 2.5rem; }

        @media (max-width: 768px) {
          .page { padding-top: 2rem !important; }
          .portfolio-content-panel { border-radius: 0; border-left: none; border-right: none; }
          .panel-body { padding: 1.5rem; }
          .panel-toolbar { padding: 1rem; overflow-x: auto; position: relative; }
          .header-title { font-size: 3rem; }
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
