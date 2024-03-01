import { useFetch } from "./useFetch";
import { useSessionInfo } from "./useSessionInfo";

type User = {
  name: string;
  username: string;
};

export function useLoggedInUser(): User | null {
  const [sessionInfo] = useSessionInfo();

  const { data } = useFetch(
    `/api/getUser?userId=${sessionInfo?.userId}`,
    [sessionInfo?.userId],
    sessionInfo?.userId != null
  );

  if (!sessionInfo?.userId || !data) {
    return null;
  }

  return data as User;
}
