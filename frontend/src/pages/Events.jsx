import React from 'react';
import PortfolioLayout from '../layouts/PortfolioLayout';

const Events = ({ settings }) => {
  return (
    <PortfolioLayout
      settings={settings}
      category="event"
      title="Events"
      bgText="EVENTS"
      seoDescription="Professional event photographer in Tunisia providing premium photography services for weddings, corporate galas, and private celebrations. Cinematic visual storytelling by Josef Nhidi."
      seoKeywords={settings?.seo_keywords || "professional event photography, cinematic wedding photographer, corporate event coverage, documentary photography, Josef Nhidi, photographer Tunisia, professional photography services"}
      url="/events"
    />
  );
};

export default Events;
