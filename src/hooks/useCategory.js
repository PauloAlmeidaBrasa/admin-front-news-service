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