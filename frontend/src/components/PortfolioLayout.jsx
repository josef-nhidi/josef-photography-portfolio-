import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MasonryGrid from './MasonryGrid';
import AlbumCard from './AlbumCard';
import SEO from './SEO';

const PortfolioLayout = ({ 
  settings, 
  category, 
  title, 
  bgText, 
  seoDescription, 
  seoKeywords, 
  url 
}) => {
  const [groupedImages, setImages] = useState({});
  const [allImages, setAllImages] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'albums'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get(`/photos/category/${category}`);
        const data = response.data;
        
        // Group by album ID
        let grouped = data.reduce((acc, photo) => {
          const albumId = photo.album_id || 'null';
          if (!acc[albumId]) {
            acc[albumId] = {
              name: photo.album ? photo.album.name : 'null',
              photos: []
            };
          }
          acc[albumId].photos.push(photo);
          return acc;
        }, {});

        // Sort by views
        Object.keys(grouped).forEach(id => {
          grouped[id].photos.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        });
        
        setAllImages(data);
        setImages(grouped);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [category]);

  if (loading) return <div className="loader container">Loading...</div>;

  return (
    <section className={`page ${category}-page`} style={{ paddingTop: '4rem' }}>
      <SEO
        settings={settings}
        title={title}
        description={seoDescription}
        keywords={seoKeywords}
        url={url}
      />
      <div className="container">
        <header className="page-header">
          <span className="header-label">Portfolio</span>
          <h1 className="header-title">{title}</h1>
          <div className="header-bg-text">{bgText}</div>
        </header>

        <div className="portfolio-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Work
          </button>
          <button 
            className={`tab-btn ${activeTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveTab('albums')}
          >
            Albums
          </button>
        </div>

        {activeTab === 'all' ? (
          <div className="all-photos-section">
            <MasonryGrid images={allImages} />
          </div>
        ) : (
          <div className="albums-section">
            {Object.entries(groupedImages).filter(([id]) => id !== 'null').length > 0 ? (
              <div className="albums-grid">
                {Object.entries(groupedImages)
                  .filter(([id]) => id !== 'null')
                  .map(([id, albumData]) => (
                    <AlbumCard key={id} album={{ id, name: albumData.name, photos: albumData.photos }} />
                  ))}
              </div>
            ) : (
              <p className="no-images">No albums found in this category.</p>
            )}
          </div>
        )}

        {allImages.length === 0 && (
          <p className="no-images">No photos available yet.</p>
        )}
      </div>

      <style jsx="true">{`
        @media (max-width: 768px) {
          .page { padding-top: 2rem !important; }
        }
      `}</style>
    </section>
  );
};

export default PortfolioLayout;
