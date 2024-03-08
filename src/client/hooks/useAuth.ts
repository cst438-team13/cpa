import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

// Provides login/logout functions that automatically update state
export function useAuth() {
  const queryClient = useQueryClient();

  const loginUser = async (username: string, password: string) => {
    const success = await api.authLoginWithPassword(username, password);

    if (success) {
      // We just changed the result of getCurrentUser(), so refetch it.
      await queryClient.refetchQueries({ queryKey: ["getCurrentUser"] });
      return true;
    }

    return false;
  };

  const logoutUser = async () => {
    const success = await api.authLogout();
    await queryClient.refetchQueries({ queryKey: ["getCurrentUser"] });

    return success;
  };

  return { loginUser, logoutUser };
}
