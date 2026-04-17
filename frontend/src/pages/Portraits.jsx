import React from 'react';
import PortfolioLayout from '../layouts/PortfolioLayout';

const Portraits = ({ settings }) => {
  return (
    <PortfolioLayout
      settings={settings}
      category="portrait"
      title="Portraits"
      bgText="PORTRAITS"
      seoDescription="Professional portrait photographer in Tunisia providing premium photography services for cinematic headshots and creative sessions. High-fidelity visual storytelling by Josef Nhidi."
      seoKeywords={settings?.seo_keywords || "professional portrait photography, high-end headshots, cinematic portraits, Josef Nhidi, photographer Tunisia, studio photography Gabes, professional photography services"}
      url="/portraits"
    />
  );
};

export default Portraits;
