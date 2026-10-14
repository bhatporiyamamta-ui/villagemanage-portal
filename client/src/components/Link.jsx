import React from 'react';
import { useVillage } from '../context/VillageContext';

/**
 * Professional accessible Link component that provides:
 * 1. Real readable href in browser status bar and link preview
 * 2. Seamless client-side navigation with pushState (no page reload)
 * 3. Support for Ctrl+Click / Cmd+Click / middle-click to open in new tab
 * 4. Full keyboard accessibility
 */
export default function Link({
  to,
  href,
  onClick,
  className = '',
  children,
  target,
  rel,
  ...props
}) {
  const { navigateTo } = useVillage();
  const destination = to || href || '#';

  const handleClick = (e) => {
    // If target="_blank", or modifier key is held, or right/middle click, let native browser handle
    if (
      target === '_blank' ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      if (onClick) onClick(e);
      return;
    }

    // If external URL (starts with http:// or https:// or mailto: or tel:), allow native handling
    if (/^(https?:|mailto:|tel:)/i.test(destination)) {
      if (onClick) onClick(e);
      return;
    }

    e.preventDefault();
    if (onClick) onClick(e);
    navigateTo(destination);
  };

  return (
    <a
      href={destination}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </a>
  );
}
