import React, { createContext, useContext } from "react";
import { useFetch } from "./useFetch";
import { useSessionInfo } from "./useSessionInfo";

type User = {
  name: string;
  username: string;
};

const LoggedInUserContext = createContext<User | null>(null);

type Props = {
  children: React.ReactNode;
};

export function LoggedInUserProvider({ children }: Props) {
  const sessionInfo = useSessionInfo();

  const { data } = useFetch(
    `/api/getUser?userId=${sessionInfo?.userId}`,
    [sessionInfo?.userId],
    sessionInfo?.userId != null
  );

  return (
    <LoggedInUserContext.Provider
      value={!sessionInfo?.userId ? null : (data as User)}
    >
      {children}
    </LoggedInUserContext.Provider>
  );
}

export function useLoggedInUser(): User | null {
  const user = useContext(LoggedInUserContext);
  return user;
}
