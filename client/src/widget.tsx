
import { createRoot } from 'react-dom/client';
import FinderApp from './pages/FinderApp';
import './index.css';

// Create and export the widget initialization function
export function initWidget() {
  class AgentFinderWidget extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      const container = document.createElement('div');
      shadow.appendChild(container);
      
      const root = createRoot(container);
      root.render(<FinderApp />);
    }
  }

  customElements.define('agent-finder-widget', AgentFinderWidget);

  // Initialize widget
  const containers = document.querySelectorAll('#agent-finder-widget');
  containers.forEach(container => {
    const widget = document.createElement('agent-finder-widget');
    container.appendChild(widget);
  });
}

// Auto-initialize when loaded as a script
initWidget();
