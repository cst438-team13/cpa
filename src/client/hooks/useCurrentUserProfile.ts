import { useQuery } from "./useQuery";

export function useCurrentUserProfile() {
  // Using useQuery() over api.getCurrentUserProfile() for two reasons:
  // 1. We want this to automatically refresh when logging in/out
  // 2. We want to show a loading spinner while this is being fetched

  const id = useQuery("getCurrentUserId");
  const user = useQuery(
    {
      method: "getUserProfile",
      enabled: id != null,
    },
    id!
  );

  return id ? user : null;
}
