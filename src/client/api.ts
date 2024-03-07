import { rpcClient } from "typed-rpc";
import type { APIService } from "../server/server";

const apiClient = rpcClient<APIService>("http://localhost:3000/api/rpc");

export const api = apiClient as Omit<typeof apiClient, "$abort">;
