
import React from 'react';
import { createRoot } from 'react-dom/client';
// Use the Full App with all routes
import App from './App'; 
import './index.css';
import 'leaflet/dist/leaflet.css';

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  
  try {
    console.log("Attempting to mount AppMinimalIndex...");
    root.render(
      <React.StrictMode>
         <App />
      </React.StrictMode>
    );
    console.log("Mount command sent.");
  } catch (error) {
    console.error("Mounting Error:", error);
    document.body.innerHTML = `<h1>Mount Error</h1><pre>${error}</pre>`;
  }

} else {
  alert("Root element not found");
}
