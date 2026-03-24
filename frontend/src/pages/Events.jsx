import React from 'react';
import PortfolioLayout from '../components/PortfolioLayout';

const Events = ({ settings }) => {
  return (
    <PortfolioLayout
      settings={settings}
      category="event"
      title={settings?.events_label || 'Events'}
      bgText={settings?.gallery_bg_text || 'EVENTS'}
      seoDescription="Explore Josef Nhidi's event photography — candid, emotional captures from weddings, corporate events, and celebrations that tell the full story of every occasion."
      seoKeywords="event photography, Josef Nhidi events, wedding photography, corporate photography, event photographer"
      url="/events"
    />
  );
};

export default Events;
