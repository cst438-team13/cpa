import { rpcClient } from "typed-rpc";
import type { APIService } from "../server/server";

type APIType = Omit<ReturnType<typeof rpcClient<APIService>>, "$abort">;

export const api = rpcClient<APIService>("/api/rpc") as APIType;
