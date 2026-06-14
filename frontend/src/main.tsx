import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BarcodeDetector } from 'barcode-detector'
import App from './App.tsx'

// Unconditionally polyfill window.BarcodeDetector to use the high-performance ZXing-C++ WebAssembly engine.
// This guarantees excellent barcode recognition (EAN-8, curved wrappers, low-contrast) across both Android and iOS.
try {
  (window as any).BarcodeDetector = BarcodeDetector;
  console.log('BarcodeDetector globally polyfilled with WebAssembly ZXing-C++ engine.');
} catch (err) {
  console.error('Failed to register BarcodeDetector polyfill:', err);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker for offline PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered successfully:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

