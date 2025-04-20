/**
 * BiggerPockets Agent Finder Widget Embed Script
 */
(function() {
  // Default configuration
  const config = {
    containerId: 'bp-agent-finder',
    width: '100%',
    height: '650px',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  };

  // Get configuration from script tag attributes
  const scriptTag = document.currentScript;
  if (scriptTag) {
    for (const key in config) {
      const attrName = 'data-' + key.toLowerCase().replace(/([A-Z])/g, '-$1');
      const attrValue = scriptTag.getAttribute(attrName);
      if (attrValue) {
        config[key] = attrValue;
      }
    }
  }

  // Create container if it doesn't exist
  let container = document.getElementById(config.containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = config.containerId;
    scriptTag.parentNode.insertBefore(container, scriptTag);
  }

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = window.location.hostname.includes('localhost') 
    ? 'http://localhost:5000/embed' 
    : window.location.origin + '/embed';
  
  // Style iframe
  iframe.style.width = config.width;
  iframe.style.height = config.height;
  iframe.style.border = config.border;
  iframe.style.borderRadius = config.borderRadius;
  iframe.style.boxShadow = config.boxShadow;
  iframe.style.display = 'block';
  
  // Add to container
  container.appendChild(iframe);
})();