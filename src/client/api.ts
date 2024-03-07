import { rpcClient } from "typed-rpc";
import type { APIService } from "../server/server";

const apiClient = rpcClient<APIService>("/api/rpc");

export const api = apiClient as Omit<typeof apiClient, "$abort">;
