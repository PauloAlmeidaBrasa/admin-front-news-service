import { createContext, useState, useEffect, useContext } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { useMutation  } from '@tanstack/react-query';
import { newsAPINews } from '../services/api/api-admin';


export const NewsContext = createContext({});


export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);

  const queryClient = useQueryClient()

  const addNewsMutation = useMutation({
    mutationFn: (payload) => newsAPINews.add(payload),   // POST /news
    onSuccess: () => {
      queryClient.invalidateQueries(["news-list"]);
    }
  });

  const getNewsMutation = useMutation({
    mutationFn: (payload) => newsAPINews.getById(payload),   // POST /news
      onSuccess: (response) => {
      setNews(response.data);
    },
    retry: false
  });


  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <NewsContext.Provider value={{ 
      addNews: addNewsMutation.mutate,
      newsIsLoading: addNewsMutation.isLoading,
      newsError: addNewsMutation.error,
      getNews : getNewsMutation.mutate,
      news, 
      formatDate, 
      setNews,
      }}>
      {children}
    </NewsContext.Provider>
  );
};
export const useNews = () => useContext(NewsContext);
