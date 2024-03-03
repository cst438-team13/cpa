import axios from "axios";

// Provides user information used to update existing values in server
export function useUpdateUser() {
  const updateUser = async (
    id: number,
    name: string,
    password: string
  ): Promise<boolean> => {
    const res = await axios.post("/api/updateUser", {
      id,
      name,
      password,
    });

    return res.data.success;
  };

  return { updateUser };
}
