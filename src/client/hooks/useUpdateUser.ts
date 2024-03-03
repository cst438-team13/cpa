import axios from "axios";

// Provides user information used to update existing values in server
export function useUpdateUser() {
  const updateUser = async (
    id: number,
    username: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    const res = await axios.post("/api/update", {
      id,
      username,
      password,
      name,
    });

    if (res.data.success) {
      return true;
    }

    return false;
  };

  return { updateUser };
}
