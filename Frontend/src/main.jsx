import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ChallengeProvider } from './context/ChallengeContext.jsx'
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader.jsx';

const preloaderRoot = ReactDOM.createRoot(document.getElementById('preloader-root'));
preloaderRoot.render(
  <React.StrictMode>
    <Preloader />
  </React.StrictMode>
);

// Remove preloader immediately after main app mounts
preloaderRoot.unmount();
document.getElementById('preloader-root').remove();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <ChallengeProvider>
            <App />
          </ChallengeProvider>
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)