import { API } from "../client";
import { useRefetchSessionInfo } from "./useSessionInfo";

// Provides login/logout functions that automatically update state
export function useAuth() {
  const refetchSessionInfo = useRefetchSessionInfo();

  const loginUser = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const success = await API.authLogin(username, password);

    if (success) {
      refetchSessionInfo();
      return true;
    }

    return false;
  };

  const logoutUser = async (): Promise<boolean> => {
    const success = await API.authLogout();
    refetchSessionInfo();

    return success;
  };

  return { loginUser, logoutUser };
}
