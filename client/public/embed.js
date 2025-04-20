/**
 * BiggerPockets Agent Finder Widget Embed Script
 */
(function() {
  // Get the script tag
  const scriptTag = document.currentScript;
  
  // Get configuration from data attributes
  const config = {
    containerId: scriptTag.getAttribute('data-container') || 'bp-agent-finder',
    width: scriptTag.getAttribute('data-width') || '100%',
    height: scriptTag.getAttribute('data-height') || '650px',
    border: scriptTag.getAttribute('data-border') || 'none',
    borderRadius: scriptTag.getAttribute('data-radius') || '8px'
  };

  // Create container if it doesn't exist
  let container = document.getElementById(config.containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = config.containerId;
    document.currentScript.parentNode.insertBefore(container, document.currentScript);
  }

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = window.location.hostname.includes('localhost') 
    ? 'http://localhost:5000' 
    : window.location.origin;
  
  // Style iframe
  iframe.style.width = config.width;
  iframe.style.height = config.height;
  iframe.style.border = config.border;
  iframe.style.borderRadius = config.borderRadius;
  iframe.style.overflow = 'hidden';
  
  // Add to container
  container.appendChild(iframe);
})();