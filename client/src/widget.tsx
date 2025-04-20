
import { createRoot } from 'react-dom/client';
import FinderApp from './pages/FinderApp';
import './index.css';

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

// Initialize widget when script loads
window.addEventListener('load', () => {
  const containers = document.querySelectorAll('#agent-finder-widget');
  containers.forEach(container => {
    const widget = document.createElement('agent-finder-widget');
    container.appendChild(widget);
  });
});
