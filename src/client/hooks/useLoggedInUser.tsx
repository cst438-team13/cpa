import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSessionInfo } from "./useSessionInfo";

type User = {
  id: number;
  name: string;
  username: string;
};

export function useLoggedInUser(): User | null {
  const sessionInfo = useSessionInfo();
  const userId = sessionInfo?.userId ?? null;

  const res = useQuery({
    queryKey: ["getUser", "getSessionInfo"],
    queryFn: () =>
      axios.get(`/api/getUser?userId=${userId}`).then((o) => o.data),
    enabled: userId != null,
  });

  return userId == null ? null : (res.data as User);
}
