import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

// Provides login/logout functions that automatically update state
export function useAuth() {
  const queryClient = useQueryClient();

  const loginUser = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const success = await api.loginSession(username, password);

    if (success) {
      // We just changed the result of getCurrentUser(), so refetch it.
      await queryClient.invalidateQueries({ queryKey: ["getCurrentUser"] });
      return true;
    }

    return false;
  };

  const logoutUser = async (): Promise<boolean> => {
    const success = await api.logoutSession();
    await queryClient.invalidateQueries({ queryKey: ["getCurrentUser"] });

    return success;
  };

  return { loginUser, logoutUser };
}
