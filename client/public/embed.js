/**
 * BiggerPockets Agent Finder Widget
 * Embed script for including the agent finder on any website
 */
(function() {
  // Configuration with defaults
  const config = {
    containerId: 'bp-agent-finder-widget',
    width: '100%',
    height: '650px',
    primaryColor: '#3b82f6', // Default blue color
    buttonText: 'Find an Agent',
    modalMode: false,
    targetUrl: window.location.hostname.includes('localhost') 
      ? 'http://localhost:5000/embed' 
      : 'https://REPLIT_URL_HERE/embed'
  };

  // Parse configuration from script tag data attributes
  const scriptTag = document.currentScript;
  if (scriptTag) {
    Object.keys(config).forEach(key => {
      const dataValue = scriptTag.getAttribute(`data-${key.toLowerCase()}`);
      if (dataValue) {
        // Convert string boolean values to actual booleans
        if (dataValue === 'true') config[key] = true;
        else if (dataValue === 'false') config[key] = false;
        else config[key] = dataValue;
      }
    });
  }

  // Create CSS for the widget
  const css = `
    #${config.containerId} {
      width: ${config.width};
      height: ${config.modalMode ? 'auto' : config.height};
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    #${config.containerId}-iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .bp-agent-finder-btn {
      background-color: ${config.primaryColor};
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    
    .bp-agent-finder-btn:hover {
      background-color: ${adjustColor(config.primaryColor, -20)};
    }
    
    .bp-agent-finder-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      align-items: center;
      justify-content: center;
    }
    
    .bp-agent-finder-modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }
    
    .bp-agent-finder-close {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      color: #666;
      z-index: 1;
    }
    
    @media (max-width: 768px) {
      .bp-agent-finder-modal-content {
        width: 95%;
        max-width: 95%;
      }
    }
  `;

  // Helper function to adjust color brightness
  function adjustColor(color, amount) {
    // Remove # if present
    color = color.replace(/^#/, '');
    
    // Parse r, g, b values
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    // Adjust values
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Create and append style
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Initialize the widget
  function initWidget() {
    // Find or create container
    let container = document.getElementById(config.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = config.containerId;
      document.body.appendChild(container);
    }

    if (config.modalMode) {
      // Create button
      const button = document.createElement('button');
      button.className = 'bp-agent-finder-btn';
      button.textContent = config.buttonText;
      
      // Create modal
      const modal = document.createElement('div');
      modal.className = 'bp-agent-finder-modal';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'bp-agent-finder-modal-content';
      
      const closeBtn = document.createElement('span');
      closeBtn.className = 'bp-agent-finder-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = () => modal.style.display = 'none';
      
      const iframe = document.createElement('iframe');
      iframe.id = `${config.containerId}-iframe`;
      iframe.src = config.targetUrl;
      
      modalContent.appendChild(closeBtn);
      modalContent.appendChild(iframe);
      modal.appendChild(modalContent);
      
      button.onclick = () => {
        modal.style.display = 'flex';
      };
      
      container.appendChild(button);
      document.body.appendChild(modal);
    } else {
      // Create iframe for direct embedding
      const iframe = document.createElement('iframe');
      iframe.id = `${config.containerId}-iframe`;
      iframe.src = config.targetUrl;
      container.appendChild(iframe);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();