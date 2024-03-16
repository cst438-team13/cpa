import {
  Updater,
  UseQueryOptions,
  useQueryClient,
  useSuspenseQuery as useTanstackSuspenseQuery,
} from "@tanstack/react-query";
import { api } from "../api";

type API = typeof api;

// NOTE: Don't worry about this file, mostly
// derived from https://github.com/fgnass/react-api-query/blob/main/src/query.ts

export function useRefetchQuery<T extends keyof API>() {
  const queryClient = useQueryClient();

  return async (method: T, ...args: Parameters<API[T]>) => {
    await queryClient.refetchQueries({
      queryKey: [method, ...args],
    });
  };
}

export function useQuery<
  T extends keyof API,
  TQueryFnData = ReturnType<API[T]>,
  TData = Awaited<TQueryFnData>,
>(
  opts: T | (Omit<UseQueryOptions<TData>, "queryKey"> & { method: T }),
  ...args: Parameters<API[T]>
) {
  const method = typeof opts === "object" ? opts.method : opts;
  const queryKey = [method, ...args] as const;

  const apiFn: (...args: Parameters<API[T]>) => TQueryFnData = api[
    method
  ] as typeof apiFn;

  const queryFn = () => apiFn.apply(api, args);
  const queryOpts = typeof opts === "object" ? opts : {};

  const result = useTanstackSuspenseQuery<TQueryFnData, Error, TData>({
    queryKey,
    queryFn,
    ...queryOpts,
  });

  const queryClient = useQueryClient();

  return {
    ...result,
    queryKey,
    update: (updater: Updater<TData | undefined, TData | undefined>) => {
      queryClient.setQueryData(queryKey, updater);
    },
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
    removeQuery: () => {
      queryClient.removeQueries({
        queryKey,
      });
    },
  };
}
