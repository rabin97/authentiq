export const queryKeys = {
  users: {
    all: ["users"] as const,
    lists: (params?: Record<string, unknown>) =>
      params
        ? ([...queryKeys.users.all, "list", params] as const)
        : ([...queryKeys.users.all, "list"] as const),
    detail: (id: number) => [...queryKeys.users.all, "detail", id] as const,
    posts: (userId: number, params?: Record<string, unknown>) =>
      params
        ? ([...queryKeys.users.all, "posts", userId, params] as const)
        : ([...queryKeys.users.all, "posts", userId] as const),
  },
  posts: {
    all: ["posts"] as const,
    lists: (params?: Record<string, unknown>) =>
      params
        ? ([...queryKeys.posts.all, "list", params] as const)
        : ([...queryKeys.posts.all, "list"] as const),
    detail: (id: number) => [...queryKeys.posts.all, "detail", id] as const,
    byTag: (tag: string) => [...queryKeys.posts.all, "tag", tag] as const,
  },
  auth: {
    currentUser: () => ["auth", "currentUser"] as const,
    permissions: () => ["auth", "permissions"] as const,
  },
  search: {
    query: (searchTerm: string) => ["search", searchTerm] as const,
    global: (searchTerm: string, filters?: Record<string, unknown>) =>
      filters
        ? (["search", "global", searchTerm, filters] as const)
        : (["search", "global", searchTerm] as const),
  },
  aadhaar: {
    all: ["aadhaar"] as const,
    upload: () => [...queryKeys.aadhaar.all, "upload"] as const,
    verification: (id?: string) =>
      id
        ? ([...queryKeys.aadhaar.all, "verification", id] as const)
        : ([...queryKeys.aadhaar.all, "verification"] as const),
  },
};
