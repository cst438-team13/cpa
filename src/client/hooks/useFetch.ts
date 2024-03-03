import axios from "axios";
import React, { useEffect, useState } from "react";

export type FetchResult<T> = {
  data: T | null;
  error: any | null;
  isLoading: boolean;
  refetch: () => void;
};

// Hook wrapper for fetch()
export function useFetch<T>(
  url: string,
  deps?: React.DependencyList,
  condition?: boolean
): FetchResult<T> {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    if (condition) {
      fetchData();
    } else {
      setData(null);
    }
  }, [url, condition, ...(deps ?? [])]);

  return { data, isLoading, error, refetch };
}
