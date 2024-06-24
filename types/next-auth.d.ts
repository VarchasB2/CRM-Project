import NextAuth from "next-auth"

declare module "next-auth" {
    interface User{
        username: string,
        userimage: string,
        role:string
    }
  interface Session {
    user: User & {
        role:string

    }
    token: {
        username: string,
        userimage: string,
        role:string
    }
  }
}