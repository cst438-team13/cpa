import { useQueryClient } from "@tanstack/react-query";
import { API } from "../client";

// Provides login/logout functions that automatically update state
export function useAuth() {
  const queryClient = useQueryClient();

  const loginUser = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const success = await API.authLogin(username, password);

    if (success) {
      await queryClient.invalidateQueries({ queryKey: ["getSessionInfo"] });
      return true;
    }

    return false;
  };

  const logoutUser = async (): Promise<boolean> => {
    const success = await API.authLogout();
    await queryClient.invalidateQueries({ queryKey: ["getSessionInfo"] });

    return success;
  };

  return { loginUser, logoutUser };
}
