import React from 'react';
import PortfolioLayout from '../layouts/PortfolioLayout';

const Portraits = ({ settings }) => {
  return (
    <PortfolioLayout
      settings={settings}
      category="portrait"
      title={settings?.portraits_label || 'Portraits'}
      bgText={settings?.gallery_bg_text || 'PORTRAITS'}
      seoDescription="Professional portrait photographer in Tunisia providing premium photography services. Cinematic and high-end personal branding, artistic studio sessions, and lifestyle portraits by Josef Nhidi."
      seoKeywords="professional portrait photography, high-end headshots, cinematic portraits, Josef Nhidi, photographer Tunisia, studio photography Gabes, professional photography services"
      url="/portraits"
    />
  );
};

export default Portraits;
