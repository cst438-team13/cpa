import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type SessionInfo = {
  userId: number | null;
};

export function useSessionInfo() {
  const res = useQuery({
    queryKey: ["getSessionInfo"],
    queryFn: () => axios.get("/api/getSessionInfo").then((o) => o.data),
  });

  return res.data as SessionInfo | null;
}
