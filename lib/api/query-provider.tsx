"use client";

import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: (failureCount, error: unknown) => {
          if (
            error &&
            typeof error === "object" &&
            "statusCode" in error &&
            typeof error.statusCode === "number" &&
            error.statusCode >= 400 &&
            error.statusCode < 500
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error: unknown, query) => {
        console.error("Query error:", error);
        console.error("Failed query:", query.queryKey);

        // You can add global error handling here:
        // - Show a toast notification
        // - Log to error tracking service (Sentry, LogRocket)
        // - Redirect to error page for critical errors

        // Example:
        // if (error instanceof ApiClientError && error.statusCode === 401) {
        //   // Redirect to login
        //   router.push('/login');
        // }
        //
        // toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: unknown, _variables, _context, mutation) => {
        console.error("Mutation error:", error);
        console.error("Failed mutation:", mutation.options.mutationKey);
      },
    }),
  });
}
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (globalThis.window === undefined) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
export function QueryProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-left"
        position="bottom"
      />
    </QueryClientProvider>
  );
}
