import { useQuery } from "./useQuery";

export function useSessionInfo() {
  const res = useQuery("getSessionInfo");
  return res.data;
}
