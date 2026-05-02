"use client";

import React, { useEffect, useState } from 'react';

interface ARViewerProps {
  product: any; 
  onClose: () => void;
}

export default function ARViewer({ product, onClose }: ARViewerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Properly load the custom element
    if (typeof window !== 'undefined') {
      import('@google/model-viewer').then(() => {
        setLoaded(true); // Only show the viewer once the library is ready
      }).catch(console.error);
    }
    
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Use the model provided by the database, or a stable fallback for testing
  const modelSrc = product.arModel || "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="text-left">
          <h3 className="font-bold text-lg leading-none">{product.name}</h3>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-semibold">
            {isMobile ? "View 3D Model or Start AR" : "3D Interactive Preview"}
          </p>
        </div>
        
        <button onClick={onClose} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Main 3D Stage */}
      <div className="flex-1 relative bg-[#f8f8f8]">
        {!loaded ? (
          /* Loading State before library or model loads */
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-gray-400">LOADING 3D ENGINE...</p>
          </div>
        ) : (
          /* @ts-ignore */
          <model-viewer
            src={modelSrc}
            ios-src={product.iosModel || ""}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-placement="floor"
            camera-controls
            touch-action="pan-y"
            auto-rotate
            shadow-intensity="1.5"
            shadow-softness="1"
            environment-image="neutral"
            exposure="1"
            poster={product.images ? product.images[0] : ""}
            alt={`A 3D model of ${product.name}`}
            style={{ width: '100%', height: '100%' }}
          >
            {/* This button only shows on Mobile when the 3D view is ready */}
            <button 
              slot="ar-button" 
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
            >
              <span className="text-xl">📷</span>
              VIEW IN YOUR ROOM
            </button>

            {/* Custom loader for the 3D model itself */}
            <div slot="progress-bar" className="hidden"></div> 
          </model-viewer>
        )}
      </div>

      {/* Footer Instructions */}
      {!isMobile && (
        <div className="p-6 bg-white border-t text-center">
            <p className="text-sm text-gray-500 font-medium">
               Use your mouse to rotate and zoom the furniture
            </p>
        </div>
      )}
    </div>
  );
}