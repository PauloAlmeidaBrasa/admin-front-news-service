import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { NewsProvider } from './context/NewsContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthProvider>
        <NewsProvider>
          <App />
        </NewsProvider>
     </AuthProvider>
  </StrictMode>,
)
