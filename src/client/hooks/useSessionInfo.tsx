import React, { createContext, useContext } from "react";
import { FetchResult, useFetch } from "./useFetch";

type SessionInfo = {
  userId: number | null;
};

const SessionInfoContext = createContext<FetchResult<SessionInfo>>(null);

type Props = {
  children: React.ReactNode;
};

export function SessionInfoProvider({ children }: Props) {
  const res = useFetch<SessionInfo>("/api/getSessionInfo");

  return (
    <SessionInfoContext.Provider value={res}>
      {children}
    </SessionInfoContext.Provider>
  );
}

export function useSessionInfo() {
  const { data } = useContext(SessionInfoContext);
  return data;
}

export function useRefetchSessionInfo() {
  const { refetch } = useContext(SessionInfoContext);
  return refetch;
}
