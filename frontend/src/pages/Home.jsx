import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MasonryGrid from '../components/MasonryGrid';
import SEO from '../components/SEO';

const Home = ({ settings }) => {
  const [images, setImages] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, albumsRes] = await Promise.all([
          api.get('/photos'),
          api.get('/albums')
        ]);
        setImages(photosRes.data);
        setAlbums(albumsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loader container">Loading...</div>;
  }

  return (
    <section className="home-page">
      <SEO
        settings={settings}
        title="Portfolio"
        description="Browse Josef Nhidi's complete photography portfolio — a curated collection of portrait and event photography capturing the essence of every moment."
        keywords="Josef Nhidi portfolio, portrait photography, event photography, professional photography gallery"
        url="/"
      />
      {/* ── GALLERY SECTION ── */}
      <div id="gallery" className="container">
        {images.length > 0 ? (
          <MasonryGrid images={images} />
        ) : (
          <div className="no-images">
             <p>No images found for this category.</p>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .home-page { padding-top: 0; }
        
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
          line-height: 1;
          font-weight: 500;
          position: relative;
          z-index: 2;
        }
        .header-bg-text {
          position: absolute;
          top: -2rem;
          left: -2rem;
          font-family: var(--font-display);
          font-size: 10rem;
          font-weight: 700;
          opacity: 0.03;
          z-index: 1;
          pointer-events: none;
          line-height: 0.8;
        }

        .loader {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          letter-spacing: 3px;
        }

        .no-images {
          text-align: center;
          padding: 10rem 0;
          opacity: 0.8;
        }
      `}</style>
    </section>
  );
};

export default Home;
