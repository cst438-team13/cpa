import { api } from "../client";

// Provides user information used to update existing values in server
export function useUpdateUser() {
  const updateUser = async (
    id: number,
    name: string,
    password: string
  ): Promise<boolean> => {
    const success = api.updateUser(id, password, name);
    return success;
  };

  return { updateUser };
}
