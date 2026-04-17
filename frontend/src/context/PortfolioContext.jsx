import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const PortfolioContext = createContext();

/**
 * PortfolioProvider
 * Manages global caching of portfolio data to enable instant page transitions.
 */
export const PortfolioProvider = ({ children }) => {
  const [cache, setCache] = useState({}); // { category: { photos: [], albums: [], grouped: {} } }
  const [loadingMap, setLoadingMap] = useState({}); // { category: boolean }

  const fetchCategoryData = useCallback(async (category) => {
    // If we have cached data, we return it instantly
    if (cache[category]) return cache[category];

    setLoadingMap(prev => ({ ...prev, [category]: true }));

    try {
      const response = await api.get(`/photos/category/${category}`);
      const data = response.data;

      // Group by album ID (Logic moved from Layout to Global)
      const grouped = data.reduce((acc, photo) => {
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

      const categoryData = {
        photos: data,
        grouped: grouped
      };

      setCache(prev => ({ ...prev, [category]: categoryData }));
      return categoryData;
    } catch (error) {
      console.error(`Portfolio Cache Error (${category}):`, error);
      return null;
    } finally {
      setLoadingMap(prev => ({ ...prev, [category]: false }));
    }
  }, [cache]);

  return (
    <PortfolioContext.Provider value={{ 
      cache, 
      loadingMap, 
      fetchCategoryData 
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};
