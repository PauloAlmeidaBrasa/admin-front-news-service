import { useMutation, useQueryClient } from '@tanstack/react-query';
import { newsAPIAuth } from '../services/api/api-admin';


export const useLogin = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => newsAPIAuth.getLogin(credentials),
    onSuccess: (data) => {


      localStorage.setItem('auth', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      queryClient.invalidateQueries(['user']);

      if (options.onSuccess) {
        options.onSuccess(data);
      }

    },
    onError: (err) => {
      console.log("LOGIN ERROR:", err);
      if (options.onError) options.onError(err);
    },
  });
};

export const useLogout = (options = {}) => {
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    // Remove stored auth info
    localStorage.removeItem('auth');
    localStorage.removeItem('user');

    // Clear React Query cache
    queryClient.clear();

    onSuccess: (data) => {

    queryClient.invalidateQueries(['user']);

      if (options.onSuccess) {
        options.onSuccess(data);
      }

    }
  };

  return logout;
};



// A simple function that calls the API – allowed everywhere
// export const useLogin = (options = {}) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     queryKey: ['user'],
//     mutationFn: (credentials) => newsAPIAuth.getLogin(credentials),
//     onSuccess: (...args) => {
//       // alert('kmks')
//       // queryClient.invalidateQueries('user');
//       if (options.onSuccess) {
//         options.onSuccess(...args);
//       }
//       queryClient.invalidateQueries('user');
//     },
//     onError: (err) => {
//       console.log("LOGIN ERROR:", err);
//     }
//   });
// }

// export const useLogin = (options = {}) => {
//   const queryClient = useQueryClient();

//     const navigate = useNavigate()

//   return useMutation({
//     mutationFn: (credentials) => newsAPIAuth.getLogin(credentials),
//     onSuccess: (data) => {
//       console.log("LOGIN SUCCESS:", data);

//       queryClient.invalidateQueries(['user']);

//       // call your custom option
//       if (options.onSuccess) {
//         options.onSuccess(data);
//       }
//     },
//     onError: (err) => {
//       if (options.onError) {
//         options.onError(err);
//       }
//       console.log("LOGIN ERROR:", err);
//     },
//   });
// };


//   // return newsAPIAuth.getLogin(credentials);
// }

// export const useLogin = (credentials) => {
//   // const queryClient = useQueryClient();

//   console.log(credentials)
//   return newsAPIAuth.getLogin(credentials)

//   // return {}

//   // return useMutation({
//   //   mutationFn: (credentials) => newsAPIAuth.getLogin(credentials),
//   //   onSuccess: () => {
//   //     // queryClient.invalidateQueries(['news-list']); // auto refresh list
//   //   },
//   // });
// };


// export const useLogin = (options = {}) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (credentials) => {
//       return await newsAPIAuth.getLogin(credentials);
//     },

//     onSuccess: (response, ...args) => {
//             alert(2)

//       console.log(response)

//       if(response.data.error == "invalid_credentials") {
//                     alert(3)

//         setErrors({ general: response.data.message })
//         return
//       }
//       // Handle successful login
//       const { access_token, user } = response.data;
      
//       // Store token and user data
//       localStorage.setItem('auth', access_token);
//       localStorage.setItem('user', JSON.stringify(user));

//       // navigate("/news");



//       // optional callback passed from component
//       if (options.onSuccess) {
//         options.onSuccess(response, ...args);
//       }

//       // invalidate anything that depends on logged user
//       queryClient.invalidateQueries(["news-list"]);
//       // queryClient.invalidateQueries(["auth"]);
//     },

//     onError: (error) => {
//       if (options.onError) {
//         options.onError(error);
//       }
//     },
//   });
// }

// export const useLogin = () => {
 
//   // const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (credentials) => {
//       return await newsAPIAuth.getLogin(credentials);
//     },

//     onSuccess: (response, ...args) => {
//             alert(2)

//       console.log(response)

//       if(response.data.error == "invalid_credentials") {
//                     alert(3)

//         setErrors({ general: response.data.message })
//         return
//       }
//       // Handle successful login
//       const { access_token, user } = response.data;
      
//       // Store token and user data
//       localStorage.setItem('auth', access_token);
//       localStorage.setItem('user', JSON.stringify(user));

//       // navigate("/news");



//       // optional callback passed from component
//       if (options.onSuccess) {
//         options.onSuccess(response, ...args);
//       }

//       // invalidate anything that depends on logged user
//       // queryClient.invalidateQueries(["news-list"]);
//       // queryClient.invalidateQueries(["auth"]);
//     },

//     onError: (error) => {
//       if (options.onError) {
//         options.onError(error);
//       }
//     },
//   });
// };


// export const useAddTodo = () => {
//   const { mutate: addTodo, isLoading, error } = useMutation(newsAPIAuth.getLogin(credentials), {
//     onSuccess: () => {
//       // Success actions
//     },
//     onError: (error) => {
//       // Error actions
//     },
//   });

//   return {
//     addTodo,
//   };
// };

  // const loginMutation = useMutation({}, {
  //   onSuccess: (response) => {
  //     console.log(response)
  //     // Success actions
  //   },
  //   onError: (error) => {
  //     console.log(error)
  //     // Error actions
  //   },
  // });

export const authenticated = () => {

  console.log(localStorage.getItem('auth'))

  return localStorage.getItem('auth')

} 


export const login = async (credentials) => { 

  console.log(credentials)
  return await newsAPIAuth.getLogin(credentials)
  // .then((response) => {
  // console.log(response)
  //   const { access_token, user } = response.data;
    
  //   // Store token and user data
  //   localStorage.setItem('auth', access_token);
  //   localStorage.setItem('user', JSON.stringify(user));
  // })
}