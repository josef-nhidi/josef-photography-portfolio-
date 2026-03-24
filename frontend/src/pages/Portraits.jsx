import React from 'react';
import PortfolioLayout from '../components/PortfolioLayout';

const Portraits = ({ settings }) => {
  return (
    <PortfolioLayout
      settings={settings}
      category="portrait"
      title={settings?.portraits_label || 'Portraits'}
      bgText={settings?.gallery_bg_text || 'PORTRAITS'}
      seoDescription="Discover Josef Nhidi's portrait photography — a collection of powerful, intimate portraits that reveal the depth and character of every subject."
      seoKeywords="portrait photography, Josef Nhidi portraits, professional portraits, studio photography"
      url="/portraits"
    />
  );
};

export default Portraits;
