import { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { newsAPICategory } from "../services/api/api-admin";
import { useMutation,useQuery } from "@tanstack/react-query";

export const CategoryContext = createContext({});

export const CategoryProvider = ({ children }) => {


  const { data: categories, isLoading: categoriesLoading } = useQuery({
      queryKey: ["categories"],
      queryFn: () => newsAPICategory.getAll().then(res => res.data),
      // staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return (
    <CategoryContext.Provider value={{ categories, categoriesLoading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
