import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PageLoader from './components/ui/PageLoader.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLoader>
      <App />
    </PageLoader>
  </StrictMode>
);
