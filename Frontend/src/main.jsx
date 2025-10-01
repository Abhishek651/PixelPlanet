// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'


// Finds the <div id="root"></div> that lives in index.html and turns it into a reactive root
ReactDOM.createRoot(document.getElementById('root')).render(
  // Tells React to take the JSX you pass in and mount it into that root element. The tree you render is: <React.StrictMode> → <AuthProvider> → <App />.
  <React.StrictMode>

     {/* context provider that likely holds authentication state (user, login(), logout(), etc.) and makes it available to every component inside app */}
    <AuthProvider>
      <App />
    {/* Your actual application component (router, layout, pages…). It receives the context values via useContext(AuthContext) or the AuthProvider’s consumer API.	Keeps your UI code clean and focused on presentation/logic */}
    </AuthProvider>
  </React.StrictMode>,
)