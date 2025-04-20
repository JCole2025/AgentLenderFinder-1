/**
 * BiggerPockets Agent Finder Widget Embed Script
 * Version: 1.0.1
 */
(function() {
  try {
    // Default configuration
    const config = {
      containerId: 'bp-agent-finder',
      width: '100%',
      height: '650px',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      scrolling: 'no', // Default to no scrolling
      allowFullscreen: false,
      loading: 'eager', // Use eager loading for better performance
      referrerPolicy: 'no-referrer-when-downgrade' // Security best practice
    };

    // Get configuration from script tag attributes
    const scriptTag = document.currentScript;
    if (!scriptTag) {
      console.error('[BiggerPockets Agent Finder] Cannot find current script tag');
      return;
    }

    // Get script source base URL (to determine where to load the embed from)
    const scriptSrc = scriptTag.src;
    const scriptHost = new URL(scriptSrc).origin;

    // Parse configuration attributes
    for (const key in config) {
      const attrName = 'data-' + key.toLowerCase().replace(/([A-Z])/g, '-$1');
      const attrValue = scriptTag.getAttribute(attrName);
      if (attrValue) {
        // Convert string "true"/"false" to boolean for boolean attributes
        if (attrValue === 'true' || attrValue === 'false') {
          config[key] = attrValue === 'true';
        } else {
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

    // Create wrapper div to handle responsive sizing
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.overflow = 'hidden';
    wrapper.style.borderRadius = config.borderRadius;

    // Create iframe
    const iframe = document.createElement('iframe');
    
    // Set the iframe source to the embed URL on the same domain as the script
    iframe.src = `${scriptHost}/embed`;
    
    // Set iframe attributes
    iframe.title = "BiggerPockets Agent Finder";
    iframe.allow = "clipboard-write";
    iframe.loading = config.loading;
    iframe.referrerPolicy = config.referrerPolicy;
    iframe.scrolling = config.scrolling;
    iframe.allowFullscreen = config.allowFullscreen;
    
    // Set iframe styling
    iframe.style.width = config.width;
    iframe.style.height = config.height;
    iframe.style.border = config.border;
    iframe.style.borderRadius = config.borderRadius;
    iframe.style.boxShadow = config.boxShadow;
    iframe.style.display = 'block';
    
    // Error handling for iframe loading
    iframe.onerror = function() {
      console.error('[BiggerPockets Agent Finder] Failed to load iframe content');
      container.innerHTML = '<div style="padding: 20px; text-align: center; border: 1px solid #f0f0f0; border-radius: 8px;">' +
        '<h3 style="color: #e53e3e;">Widget Failed to Load</h3>' +
        '<p>Please try refreshing the page or contact support if the problem persists.</p>' +
        '</div>';
    };
    
    // Track when iframe is fully loaded
    iframe.onload = function() {
      // Send message to iframe to initialize
      setTimeout(function() {
        try {
          iframe.contentWindow.postMessage({ type: 'init', parentOrigin: window.location.origin }, '*');
        } catch (err) {
          console.warn('[BiggerPockets Agent Finder] Could not send init message to iframe');
        }
      }, 500); // Small delay to ensure iframe content is ready
    };
    
    // Handle messages from the iframe
    window.addEventListener('message', function(event) {
      try {
        // Only process messages from our iframe's source origin
        if (event.origin !== scriptHost) return;
        
        if (!event.data || typeof event.data !== 'object') return;
        
        // Process different message types
        switch (event.data.type) {
          case 'resize':
            // Dynamic height adjustment
            if (event.data.height && !isNaN(event.data.height)) {
              iframe.style.height = `${event.data.height}px`;
            }
            break;
            
          case 'ready':
            // Iframe has loaded and is ready
            console.log('[BiggerPockets Agent Finder] Widget loaded successfully');
            break;
            
          // Handle other message types as needed
        }
      } catch (err) {
        console.error('[BiggerPockets Agent Finder] Error processing message:', err);
      }
    });

    // Create a unique ID for this widget instance
    const widgetId = 'bp-agent-finder-' + Math.random().toString(36).substring(2, 9);
    iframe.setAttribute('data-widget-id', widgetId);
    
    // Add to DOM
    wrapper.appendChild(iframe);
    container.appendChild(wrapper);
    
    // Expose API for external access
    if (!window.BiggerPocketsAgentFinder) {
      window.BiggerPocketsAgentFinder = {
        instances: {}
      };
    }
    
    // Register this instance
    window.BiggerPocketsAgentFinder.instances[widgetId] = {
      iframe: iframe,
      sendMessage: function(message) {
        try {
          iframe.contentWindow.postMessage(message, scriptHost);
          return true;
        } catch (err) {
          console.error('[BiggerPockets Agent Finder] Error sending message:', err);
          return false;
        }
      },
      reset: function() {
        return this.sendMessage({ type: 'reset' });
      },
      getState: function() {
        return this.sendMessage({ type: 'getState' });
      }
    };
    
  } catch (error) {
    console.error('[BiggerPockets Agent Finder] Initialization error:', error);
    // Attempt to show error message in container
    try {
      const container = document.getElementById(config?.containerId || 'bp-agent-finder');
      if (container) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; border: 1px solid #f0f0f0; border-radius: 8px;">' +
          '<h3 style="color: #e53e3e;">Widget Error</h3>' +
          '<p>The widget could not be loaded: ' + (error.message || 'Unknown error') + '</p>' +
          '</div>';
      }
    } catch (e) {
      // Last resort error handling
      console.error('[BiggerPockets Agent Finder] Error showing error message:', e);
    }
  }
})();