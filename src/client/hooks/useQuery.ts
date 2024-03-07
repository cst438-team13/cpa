import {
  Updater,
  UseQueryOptions,
  useQueryClient,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query";
import { api } from "../api";

type APIType = typeof api;

// NOTE: Don't worry about this file, mostly
// derived from https://github.com/fgnass/react-api-query/blob/main/src/query.ts

export function useQuery<
  T extends keyof APIType,
  TQueryFnData = ReturnType<APIType[T]>,
  TData = Awaited<TQueryFnData>,
>(
  opts: T | (Omit<UseQueryOptions<TData>, "queryKey"> & { method: T }),
  ...args: Parameters<APIType[T]>
) {
  const method = typeof opts === "object" ? opts.method : opts;
  const queryKey = [method, ...args] as const;

  const apiFn: (...args: Parameters<APIType[T]>) => TQueryFnData = api[
    method
  ] as any;

  const queryFn = () => apiFn.apply(api, args);
  const queryOpts = typeof opts === "object" ? opts : {};

  const result = useTanstackQuery<TQueryFnData, Error, TData>({
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
