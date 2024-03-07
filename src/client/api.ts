import { rpcClient } from "typed-rpc";
import type { APIService } from "../server/server";

export const api = rpcClient<APIService>("http://localhost:3000/api/rpc");
