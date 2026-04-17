import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import MasonryGrid from '../components/portfolio/MasonryGrid';
import AlbumCard from '../components/portfolio/AlbumCard';
import SEO from '../components/ui/SEO';

const PortfolioLayout = ({ 
  settings, 
  category, 
  title, 
  bgText, 
  seoDescription, 
  seoKeywords, 
  url 
}) => {
  const { cache, loadingMap, fetchCategoryData } = usePortfolio();
  
  // Local state for UI responsiveness
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'albums'
  const [localData, setLocalData] = useState(cache[category] || null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCategoryData(category);
      if (data) setLocalData(data);
    };
    load();
  }, [category, fetchCategoryData]);

  // Determine if we should show the loader
  const isGlobalLoading = loadingMap[category];
  const hasData = !!localData;
  const showLoader = isGlobalLoading && !hasData;

  if (showLoader) return (
    <div className="loader-page">
      <div className="aperture-pulse"></div>
      <span className="loader-sub">Developing</span>
    </div>
  );

  const allImages = localData?.photos || [];
  const groupedImages = localData?.grouped || {};

  return (
    <section className={`page ${category}-page`} style={{ paddingTop: '4rem' }}>
      <SEO
        settings={settings}
        title={title}
        description={seoDescription}
        keywords={seoKeywords}
        url={url}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${title} | Josef Nhidi Photography`,
          "url": `https://josefnhidi.me${url}`,
          "description": seoDescription,
          "publisher": {
            "@type": "Person",
            "name": "Josef Nhidi"
          }
        }}
      />
      <div className="container">
        <header className="page-header">
          <div className="header-content">
            <span className="header-label">Portfolio Collection</span>
            <h1 className="header-title">{title}</h1>
            <p className="header-subtitle">Selected works from our professional directory</p>
          </div>
          <div className="header-bg-text">{bgText}</div>
        </header>

        <div className="portfolio-content-panel">
          <div className="panel-toolbar">
            <div className="segmented-tabs">
              <button 
                className={`segment-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Mosaic View
              </button>
              <button 
                className={`segment-btn ${activeTab === 'albums' ? 'active' : ''}`}
                onClick={() => setActiveTab('albums')}
              >
                Collections
              </button>
            </div>
          </div>

          <div className="panel-body">
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
        </div>
      </div>

    </section>
  );
};

export default PortfolioLayout;
