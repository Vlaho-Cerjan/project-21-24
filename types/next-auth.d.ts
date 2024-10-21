// <reference types="next-auth" />
import "next-auth";
import { User } from "../src/interfaces/user";

export interface user {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  roles: string[] | string;
  token: string | null;
  job_title: string | null;
  image: number | null;
  created_at: string;
  updated_at: string;
  roles: string[];
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface User extends user {}

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: User | AdapterUser;
  }
}

declare module "next-auth/session" {
  interface Session {
    user: User;
  }
}