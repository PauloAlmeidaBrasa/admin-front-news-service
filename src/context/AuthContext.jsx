

import { createContext, useState, useEffect } from 'react';
import  {  newsAPIAuth } from '../services/api/api-admin';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = sessionStorage.getItem('auth');
    return stored ? JSON.stringify(stored) : { token: null, user: null };
  });

  useEffect(() => {
    sessionStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const login = async (credentials) => {

    const res = await newsAPIAuth.getLogin(credentials)

    setAuth({
      token: res.data.access_token,
      user: res.data.user,
    });
    return res
  };

  const logout = () => setAuth({ token: null, user: null });

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

