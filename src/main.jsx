import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { NewsProvider } from './context/NewsContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CategoryProvider } from './context/CategoryContext.jsx'

const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CategoryProvider>
          <NewsProvider>
            <App />
          </NewsProvider>
        </CategoryProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
