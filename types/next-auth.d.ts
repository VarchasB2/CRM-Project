import NextAuth from "next-auth"

declare module "next-auth" {
    interface User{
        username: string,
        userimage: string
    }
  interface Session {
    user: User & {
        username: string,
        userimage: string

    }
    token: {
        username: string,
        userimage: string
    }
  }
}