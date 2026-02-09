import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

// Global error handling for unhandled rejections and errors
window.addEventListener('error', (event) => {
  console.error('Global JS Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{ 
    padding: '20px', 
    color: '#721c24', 
    backgroundColor: '#f8d7da', 
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    margin: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
    <p>The application failed to start. This is usually due to a runtime error or a missing resource.</p>
    <pre style={{ 
      backgroundColor: 'rgba(0,0,0,0.05)', 
      padding: '10px', 
      overflow: 'auto',
      fontSize: '14px'
    }}>
      {error.message}
    </pre>
    <button 
      onClick={() => window.location.reload()}
      style={{
        padding: '8px 16px',
        backgroundColor: '#721c24',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Reload Application
    </button>
  </div>
);

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Error boundary and error handling
const container = document.getElementById("root");

if (!container) {
  console.error("❌ Failed to find the root element");
  document.body.innerHTML = "<div style='padding: 20px; font-family: Arial, sans-serif; color: red;'><h2>Error: Could not find root element</h2><p>Please check if index.html has a div with id='root'</p></div>";
} else {
  try {
    const root = createRoot(container);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("❌ Error rendering app:", error);
    container.innerHTML = `<div style='padding: 20px; font-family: Arial, sans-serif; color: red;'>
      <h2>Application Error</h2>
      <p>Something went wrong while rendering the application.</p>
      <details style='margin-top: 10px; padding: 10px; background-color: #f0f0f0;'>
        <summary>Error details</summary>
        <pre>${error instanceof Error ? error.message : String(error)}</pre>
      </details>
    </div>`;
  }
}