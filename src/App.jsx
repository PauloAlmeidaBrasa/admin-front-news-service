import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import NewsList from './pages/NewsList';
import NewsCreate from './pages/NewsCreate';
import NewsEdit from './pages/NewsEdit';
import Login from './pages/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/news" element={<NewsList />} />
                <Route path="/news/create" element={<NewsCreate />} />
                <Route path="/news/edit/:id" element={<NewsEdit />} />
              </Routes>
            </Layout>
          ) : (
            <Login onLogin={() => setIsAuthenticated(true)} />
          )}
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;