import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsAPICategory } from '../services/api/api-admin';


export const useCategoryList = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await newsAPICategory.getAll();
      return res.data; // IMPORTANT
    },
  });
};

export const useCategoryById = (id) => {
  return useQuery({
    queryKey: ['category',id],
    queryFn: () => newsAPICategory.getById(id),
    enabled: !!id
  });
};

export const useUpdateCategory = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => newsAPICategory.update(params),
    onSuccess: (...args) => {
      if (options.onSuccess) {
        options.onSuccess(...args);
      }
      queryClient.invalidateQueries(['category-list']);
    },
    onError: (err) => {
      console.log(" ", err);
    },
  });
}
