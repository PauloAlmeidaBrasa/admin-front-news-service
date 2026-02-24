import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsAPINews } from '../services/api/api-admin';

// -----------------------------
// Helpers
// -----------------------------
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

// -----------------------------
// Fetch all news
// -----------------------------
export const useNewsList = () => {
  return useQuery({
    queryKey: ['news-list'],
    queryFn: () => newsAPINews.getAll(), // GET /news
  });
};

// -----------------------------
// Fetch a single news by ID
// -----------------------------
export const useNewsById = (id) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsAPINews.getById(id),
    enabled: !!id, // only fetch when ID exists
  });
};

// -----------------------------
// Create News
// -----------------------------
export const useAddNews = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => newsAPINews.add(payload),
    onSuccess: (...args) => {
      if (options.onSuccess) {
        options.onSuccess(...args);
      }
      queryClient.invalidateQueries(['news-list']); // auto refresh list
    },
  });
};

// -----------------------------
// Update News
// -----------------------------
export const useUpdateNews = (options = {}) => {
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: ({ id, payload }) => newsAPINews.update(id, payload),
    onSuccess: (...args) => {
      if (options.onSuccess) {
        options.onSuccess(...args);
      }
      queryClient.invalidateQueries(['news-list']);
    },
  });
}
export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => newsAPINews.delete(id),
    onSuccess: () => {
      // Refresh the table after deletion
      queryClient.invalidateQueries(['news-list']);
    },
  });
}
