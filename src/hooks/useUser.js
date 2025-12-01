import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsAPIUser } from '../services/api/api-admin';



export const useAddUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => newsAPIUser.add(payload),
    // mutationKey: ['']
    onSuccess: (...args) => {
      if (options.onSuccess) {
        options.onSuccess(...args);
      }
      queryClient.invalidateQueries(['user-list']);
    },
  });
};

export const useUserList = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await newsAPIUser.getAll()
      return res.data
    },
  });
};
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => newsAPIUser.delete(id),
    onSuccess: () => {
      // Refresh the table after deletion
      queryClient.invalidateQueries(['category-list']);
    },
  });
}

export const useUpdateUser = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => {
      return newsAPIUser.update({payload: params.payload})
    },
    onSuccess: (...args) => {
      if (options.onSuccess) {
        options.onSuccess(...args);
      }
      queryClient.invalidateQueries(['user-list']);
    },
    onError: (err) => {
      console.log(" ", err);
    },
  });
}

export const useUserById = (id) => {
  return useQuery({
    queryKey: ['user',id],
    queryFn: () => newsAPIUser.getById(id),
    enabled: !!id
  });
};