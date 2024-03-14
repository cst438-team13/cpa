import { Storage } from "@google-cloud/storage";
import "dotenv/config";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error(".env file is missing or GOOGLE_CLIENT_ID is not defined!");
}

const storage = new Storage({
  projectId: "pawsconnect-416820",
  scopes: "https://www.googleapis.com/auth/cloud-platform",
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
});

export const GoogleHelper = {
  getStorageBucket() {
    return storage.bucket("csumb-pawsconnect-storage");
  },
};
