// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   UseQueryOptions,
//   UseMutationOptions,
// } from "@tanstack/react-query";
// import { apiClient } from "../client";
// import { queryKeys } from "../query-keys";
// import type {
//   User,
//   CreateUserInput,
//   UpdateUserInput,
//   ApiResponse,
//   PaginatedResponse,
//   PaginationParams,
// } from "../types";

// export function useUsers(
//   params?: PaginationParams,
//   options?: Omit<
//     UseQueryOptions<PaginatedResponse<User>>,
//     "queryKey" | "queryFn"
//   >
// ) {
//   return useQuery({
//     queryKey: queryKeys.users.lists(params),

//     queryFn: async () => {
//       const queryString = params
//         ? `?${new URLSearchParams(params as any).toString()}`
//         : "";

//       const response = await apiClient.get<
//         ApiResponse<PaginatedResponse<User>>
//       >(`/users${queryString}`);

//       return response.data;
//     },

//     ...options,
//   });
// }

// export function useUser(
//   id: number | undefined,
//   options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">
// ) {
//   return useQuery({
//     queryKey: queryKeys.users.detail(id!),

//     queryFn: async () => {
//       const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
//       return response.data;
//     },

//     enabled: !!id && (options?.enabled ?? true),

//     ...options,
//   });
// }

// export function useUserPosts(
//   userId: number | undefined,
//   params?: PaginationParams,
//   options?: Omit<
//     UseQueryOptions<PaginatedResponse<any>>,
//     "queryKey" | "queryFn"
//   >
// ) {
//   return useQuery({
//     queryKey: queryKeys.users.posts(userId!, params),

//     queryFn: async () => {
//       const queryString = params
//         ? `?${new URLSearchParams(params as any).toString()}`
//         : "";

//       const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
//         `/users/${userId}/posts${queryString}`
//       );

//       return response.data;
//     },

//     enabled: !!userId && (options?.enabled ?? true),

//     ...options,
//   });
// }

// export function useCreateUser(
//   options?: UseMutationOptions<User, Error, CreateUserInput>
// ) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data: CreateUserInput) => {
//       const response = await apiClient.post<ApiResponse<User>>("/users", data);
//       return response.data;
//     },
//     onSuccess: (newUser, variables, context) => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.users.lists(),
//       });
//       queryClient.setQueryData(queryKeys.users.detail(newUser.id), newUser);

//       options?.onSuccess?.(newUser, variables, context);
//     },

//     ...options,
//   });
// }
// export function useUpdateUser(
//   options?: UseMutationOptions<
//     User,
//     Error,
//     { id: number; data: UpdateUserInput }
//   >
// ) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ id, data }) => {
//       const response = await apiClient.patch<ApiResponse<User>>(
//         `/users/${id}`,
//         data
//       );
//       return response.data;
//     },

//     onSuccess: (updatedUser, variables, context) => {
//       queryClient.setQueryData(
//         queryKeys.users.detail(variables.id),
//         updatedUser
//       );

//       queryClient.invalidateQueries({
//         queryKey: queryKeys.users.lists(),
//       });

//       options?.onSuccess?.(updatedUser, variables, context);
//     },

//     ...options,
//   });
// }

// export function useDeleteUser(
//   options?: UseMutationOptions<void, Error, number>
// ) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: number) => {
//       await apiClient.delete(`/users/${id}`);
//     },

//     onSuccess: (_data, deletedId, context) => {
//       queryClient.removeQueries({
//         queryKey: queryKeys.users.detail(deletedId),
//       });

//       queryClient.invalidateQueries({
//         queryKey: queryKeys.users.lists(),
//       });

//       options?.onSuccess?.(_data, deletedId, context);
//     },

//     ...options,
//   });
// }

// export function useUpdateUserOptimistic(
//   options?: UseMutationOptions<
//     User,
//     Error,
//     { id: number; data: UpdateUserInput }
//   >
// ) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ id, data }) => {
//       const response = await apiClient.patch<ApiResponse<User>>(
//         `/users/${id}`,
//         data
//       );
//       return response.data;
//     },

//     onMutate: async ({ id, data }) => {
//       await queryClient.cancelQueries({
//         queryKey: queryKeys.users.detail(id),
//       });

//       const previousUser = queryClient.getQueryData<User>(
//         queryKeys.users.detail(id)
//       );

//       if (previousUser) {
//         queryClient.setQueryData<User>(queryKeys.users.detail(id), {
//           ...previousUser,
//           ...data,
//         });
//       }

//       return { previousUser };
//     },

//     onError: (error, variables, context) => {
//       if (context?.previousUser) {
//         queryClient.setQueryData(
//           queryKeys.users.detail(variables.id),
//           context.previousUser
//         );
//       }

//       options?.onError?.(error, variables, context);
//     },

//     onSettled: (_data, _error, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.users.detail(variables.id),
//       });
//     },

//     ...options,
//   });
// }
