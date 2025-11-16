import { createContext, useState, useEffect } from 'react';
import { newsAPIAuth } from '../services/api/api-admin';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = sessionStorage.getItem('auth');

    // If saved auth exists → parse and use it
    if (stored) {
      try {

        return JSON.parse(stored);
      } catch (err) {
        console.error("Invalid saved auth", err);
        return { token: null, user: null };
      }
    }

    // No saved user
    return { token: null, user: null };
  });

  // Always sync with sessionStorage
  useEffect(() => {
    if (auth?.token) {
      sessionStorage.setItem('auth', JSON.stringify(auth));
    } else {
      sessionStorage.removeItem('auth');
    }
  }, [auth]);

  const login = async (credentials) => {
    const res = await newsAPIAuth.getLogin(credentials);

    setAuth({
      token: res.data.access_token,
      user: res.data.user,
    });

    return res;
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    sessionStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

