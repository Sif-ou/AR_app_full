"use client";

import React, { useEffect, useState, useRef } from 'react';

interface ARViewerProps {
  product: any; 
  selectedColor: {
    name: string;
    hex: string;
  };
  onClose: () => void;
} 

export default function ARViewer({ product,selectedColor, onClose }: ARViewerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@google/model-viewer').then(() => {
        setLoaded(true);
      }).catch(console.error);

      const isCapacitor = (window as any).Capacitor !== undefined;
      setIsNativeApp(isCapacitor);
    } 
    
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    setIsMobile(checkMobile);

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const modelSrc = product.arModel || "https://cdn.jsdelivr.net/gh/Sif-ou/AR_app_full@main/3d models/3d_model_furni-v1.glb";
  const iosSrc = product.iosModel || "";

  const handleNativeARLaunch = (e: React.MouseEvent) => {
    if (!isNativeApp) return; 

    e.preventDefault();
    e.stopPropagation();

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      if (iosSrc) {
        window.open(iosSrc, '_system');
      } else {
        alert("iOS AR USDZ model link is missing for this product.");
      }
    } else if (/Android/i.test(navigator.userAgent)) {
      const title = encodeURIComponent(product.name);
      const fallbackUrl = encodeURIComponent(window.location.href);
      const universalARUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelSrc)}&mode=ar_only&title=${title}&fallback_url=${fallbackUrl}`;
      
      window.open(universalARUrl, '_system');
    }
  };

const modelViewerRef = useRef<any>(null);

useEffect(() => {
  const modelViewer = modelViewerRef.current;
  if (!modelViewer) return;

  const applyColor = () => {
    if (!modelViewer.model || !selectedColor?.hex) return;

    const hex = selectedColor.hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const colorArray = [r, g, b, 1.0]; 

    modelViewer.model.materials.forEach((material: any) => {
      if (material.pbrMetallicRoughness) {
        material.pbrMetallicRoughness.setBaseColorFactor(colorArray);
      }
    });
  };

  modelViewer.addEventListener('load', applyColor);
  if (modelViewer.model) applyColor();

  return () => {
    modelViewer.removeEventListener('load', applyColor);
  };
}, [selectedColor, loaded]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white"> 
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="text-left">
          <h3 className="font-bold text-black text-lg leading-none">{product.name}</h3>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-semibold">
            {isMobile ? "View 3D Model or Start AR" : "3D Interactive Preview"}
          </p>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          {!isMobile && (
            <p className="text-xs text-gray-400 font-semibold">
              AR is only available on mobile
            </p>
          )}
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
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-gray-400">LOADING 3D ENGINE...</p>
          </div>
        ) : (
          /* Safely render model-viewer dynamically to bypass strict TS check errors */
          React.createElement(
            'model-viewer',
            {
              ref: modelViewerRef,
              src: modelSrc,
              'ios-src': iosSrc,
              ar: true,
              'ar-modes': 'webxr scene-viewer quick-look',
              'ar-placement': 'floor',
              'camera-controls': true,
              'touch-action': 'pan-y',
              'auto-rotate': true,
              'shadow-intensity': '1.5',
              'shadow-softness': '1',
              'environment-image': 'neutral',
              exposure: '1',
              alt: `A 3D model of ${product.name}`,
              style: { width: '100%', height: '100%' }
            },
            <>
              {isNativeApp ? (
                <button 
                  slot="ar-button"
                  onClick={handleNativeARLaunch}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[105] bg-black text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
                >
                  <span className="text-xl">📷</span>
                  VIEW IN YOUR ROOM
                </button>
              ) : (
                <button 
                  slot="ar-button" 
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
                >
                  <span className="text-xl">📷</span>
                  VIEW IN YOUR ROOM
                </button>
              )}
              <div slot="progress-bar" className="hidden"></div>
            </>
          )
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
