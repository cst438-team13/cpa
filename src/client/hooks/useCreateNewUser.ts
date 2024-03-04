import { API } from "../client";

// Provides login/logout functions that automatically update state
export function useCreateNewUser() {
  const createNewUser = async (
    username: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    const success = API.registerUser(username, password, name);
    return success;
  };

  return { createNewUser };
}
