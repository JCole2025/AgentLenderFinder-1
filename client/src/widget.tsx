import { createRoot } from 'react-dom/client';
import FinderApp from './pages/FinderApp';
import './index.css';

const initWidget = () => {
  const containers = document.querySelectorAll('#agent-finder-widget');
  containers.forEach(container => {
    const root = createRoot(container);
    root.render(<FinderApp />);
  });
};

// Auto-initialize when loaded as a script
initWidget();