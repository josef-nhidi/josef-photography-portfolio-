import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './styles/main.css';

console.log(
  "%cHELLOO! If you downloaded 1 photo, I'll give you $1000 and a happy smile! 😄",
  "color: #ac8b4d; font-size: 20px; font-weight: bold; font-family: 'Tenor Sans', sans-serif; text-transform: uppercase; border: 2px solid #ac8b4d; padding: 20px;"
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
