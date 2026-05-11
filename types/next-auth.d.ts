type DefaultSession = import("next-auth").DefaultSession;
type DefaultUser = import("next-auth").DefaultUser;

declare module "next-auth" {

  interface Session {

    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}