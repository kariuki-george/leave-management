'use client';

import React from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { errorParser } from '../fetchers';

const queryCache = new QueryCache({
  onError(err: any) {
    console.log('err', err);
    errorParser(err);
  },
});

const mutationCache = new MutationCache({
  onError(err: any) {
    errorParser(err);
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60 * 3, // 3 minutes
    },
  },
});

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export default ReactQueryProvider;
