import React from 'react';
import PortfolioLayout from '../layouts/PortfolioLayout';

const Events = ({ settings }) => {
  return (
    <PortfolioLayout
      settings={settings}
      category="event"
      title={settings?.events_label || 'Events'}
      bgText={settings?.gallery_bg_text || 'EVENTS'}
      seoDescription="Capturing the soul of your celebrations through cinematic event photography. Josef Nhidi specializes in storytelling for weddings, corporate galas, and private events with a documentary yet polished style."
      seoKeywords="professional event photography, cinematic wedding photographer, corporate event coverage, documentary photography, Josef Nhidi, candid event moments"
      url="/events"
    />
  );
};

export default Events;
