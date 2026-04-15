import React from 'react';
import PortfolioLayout from '../layouts/PortfolioLayout';

const Portraits = ({ settings }) => {
  return (
    <PortfolioLayout
      settings={settings}
      category="portrait"
      title={settings?.portraits_label || 'Portraits'}
      bgText={settings?.gallery_bg_text || 'PORTRAITS'}
      seoDescription="Explore cinematic and high-end portrait photography by Josef Nhidi. Personal branding, artistic studio sessions, and intimate lifestyle portraits captured with professional lighting and creative vision."
      seoKeywords="professional portrait photography, high-end headshots, cinematic portraits, Josef Nhidi, studio photography Paris, lifestyle photographer, artistic portraits"
      url="/portraits"
    />
  );
};

export default Portraits;
