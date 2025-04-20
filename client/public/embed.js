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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    scrolling: 'no' // Default to no scrolling
  };

  // Get configuration from script tag attributes
  const scriptTag = document.currentScript;
  if (!scriptTag) {
    console.error('Cannot find current script tag');
    return;
  }

  // Get script source base URL (to determine where to load the embed from)
  const scriptSrc = scriptTag.src;
  const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
  const scriptHost = new URL(scriptSrc).origin;

  // Parse configuration attributes
  for (const key in config) {
    const attrName = 'data-' + key.toLowerCase().replace(/([A-Z])/g, '-$1');
    const attrValue = scriptTag.getAttribute(attrName);
    if (attrValue) {
      config[key] = attrValue;
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
  
  // Set the iframe source to the embed URL on the same domain as the script
  iframe.src = `${scriptHost}/embed`;
  
  // Style iframe
  iframe.style.width = config.width;
  iframe.style.height = config.height;
  iframe.style.border = config.border;
  iframe.style.borderRadius = config.borderRadius;
  iframe.style.boxShadow = config.boxShadow;
  iframe.style.display = 'block';
  iframe.scrolling = config.scrolling;
  iframe.allow = "clipboard-write";  // Allow clipboard operations
  
  // Add iframe title for accessibility
  iframe.title = "BiggerPockets Agent Finder";
  
  // Handle messages from the iframe (for dynamic height adjustment)
  window.addEventListener('message', function(event) {
    // Verify the message comes from the iframe's domain
    if (event.origin !== scriptHost) return;
    
    // Check if the message is a height adjustment request
    if (event.data && event.data.type === 'resize' && event.data.height) {
      iframe.style.height = `${event.data.height}px`;
    }
  });

  // Add to container
  container.appendChild(iframe);
})();