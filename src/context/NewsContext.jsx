import { createContext, useState, useEffect } from 'react';

export const NewsContext = createContext({});

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <NewsContext.Provider value={{ news, formatDate, setNews }}>
      {children}
    </NewsContext.Provider>
  );
};
