import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ChallengeProvider } from './context/ChallengeContext.jsx'
import ErrorBoundary from './components/ErrorBoundary';


// Finds the <div id="root"></div> that lives in index.html and turns it into a reactive root
ReactDOM.createRoot(document.getElementById('root')).render(
  // Tells React to take the JSX you pass in and mount it into that root element. The tree you render is: <React.StrictMode> → <AuthProvider> → <App />.
  <React.StrictMode>
    <ErrorBoundary>
      {/* context provider that likely holds authentication state (user, login(), logout(), etc.) and makes it available to every component inside app */}
      <AuthProvider>
        <SettingsProvider>
          <ChallengeProvider>
            <App />
          </ChallengeProvider>
        </SettingsProvider>
        {/* Your actual application component (router, layout, pages…). It receives the context values via useContext(AuthContext) or the AuthProvider’s consumer API.	Keeps your UI code clean and focused on presentation/logic */}
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)