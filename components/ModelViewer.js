'use client';

import { useState, useEffect, useRef } from 'react';

export default function ModelViewer({ modelPath, className = '' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'MODEL_LOADED') {
        setIsLoading(false);
        setIsVisible(true);
      } else if (event.data.type === 'MODEL_ERROR') {
        setError(event.data.error || 'Failed to load 3D model');
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Set a timeout to handle cases where the model fails to load silently
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setError('Model is taking too long to load. Please refresh the page or try again later.');
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading]);

  // Build the model viewer URL
  const modelViewerUrl = `/assets/model-viewer.html?model=${encodeURIComponent(modelPath)}`;

  // Handle iframe load event
  const handleIframeLoad = () => {
    // The actual model loading is handled by the message events
    // This just ensures we don't show a white screen if the iframe loads but the model doesn't
    if (!isLoading && !error) {
      setIsVisible(true);
    }
  };

  // Reset states when modelPath changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setIsVisible(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [modelPath]);

  return (
    <div className={`relative w-full h-full bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 mt-2">Loading 3D model...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-red-50 p-4">
          <div className="text-center">
            <div className="text-red-500 font-medium">Error Loading 3D Model</div>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )}

      {/* 3D Model Viewer iframe */}
      <iframe
        ref={iframeRef}
        src={modelViewerUrl}
        className={`w-full h-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        title="3D Model Viewer"
        allowFullScreen
        allow="xr-spatial-tracking"
        loading="eager"
        onLoad={handleIframeLoad}
      />

      {/* User instructions */}
      <div className={`absolute bottom-3 right-3 text-xs text-gray-600 bg-white/90 px-3 py-1.5 rounded-md shadow-md transition-opacity duration-300 ${isVisible ? 'opacity-80 hover:opacity-100' : 'opacity-0'}`}>
        🖱️ Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
