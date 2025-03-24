import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscriptionStatus: string;
      usageCount: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    subscriptionStatus: string;
    usageCount: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    subscriptionStatus: string;
    usageCount: number;
  }
} 