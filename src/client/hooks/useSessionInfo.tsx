import nullthrows from "nullthrows";
import React, { createContext, useContext } from "react";
import { FetchResult, useFetch } from "./useFetch";

type SessionInfo = {
  userId: number | null;
};

const SessionInfoContext = createContext<FetchResult<SessionInfo> | null>(null);

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
  const val = useContext(SessionInfoContext);
  return nullthrows(val).data;
}

export function useRefetchSessionInfo() {
  const val = useContext(SessionInfoContext);
  return nullthrows(val).refetch;
}
