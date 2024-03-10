import { useQuery } from "./useQuery";

export function useCurrentUserProfile() {
  const { data } = useQuery({
    method: "getCurrentUserProfile",
  });

  return data ?? null;
}
