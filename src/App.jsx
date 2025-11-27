import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import NewsList from './pages/news/NewsList';
import NewsCreate from './pages/news/NewsCreate';
import NewsEdit from './pages/news/NewsEdit';
import Login from './pages/login/Login';
import CategoryList from './pages/category/CategoryList';
import { useLocation } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() { 
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  const location = useLocation();

  React.useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("auth"));
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;  
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>

        {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
        {isAuthenticated && (
          <>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/news" element={<Layout><NewsList /></Layout>} />
            <Route path="/news/create" element={<Layout><NewsCreate /></Layout>} />
            <Route path="/news/edit/:id" element={<Layout><NewsEdit /></Layout>} />
            <Route path="/category" element={<Layout><CategoryList /></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

      </Routes>
    </ThemeProvider>
  );
}

export default App;