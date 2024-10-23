import { useEffect } from 'react';

export function ViewportMeta() {
  useEffect(() => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    } else {
      const newViewport = document.createElement('meta');
      newViewport.name = 'viewport';
      newViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(newViewport);
    }
  }, []);

  return null;
}
