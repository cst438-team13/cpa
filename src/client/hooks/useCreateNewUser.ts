import axios from "axios";

// Provides login/logout functions that automatically update state
export function useCreateNewUser() {
  const createNewUser = async (
    username: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    const res = await axios.post("/api/register", { username, password, name });

    if (res.data.success) {
      return true;
    }

    return false;
  };

  return { createNewUser };
}
