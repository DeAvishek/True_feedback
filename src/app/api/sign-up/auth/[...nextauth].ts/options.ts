import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import dbConnect from "@/app/lib/db";
import bcrypt from "bcryptjs"
import UserModel from "@/app/models/user";

export const AuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            id: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<any> {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Email and password are required");
                }
                await dbConnect()  //connect database
                try {
                    const user = await UserModel.findOne({ email: credentials?.email })
                    if (!user) {
                        throw new Error("No user found")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first")
                    }
                    const comparePassword = await bcrypt.compare(credentials.password, user.password)
                    if (!comparePassword) {
                        throw new Error("invalid credentials..")
                    }
                    return user

                } catch (error: any) {
                    throw new Error(error)
                }

            }
        }),

    ],
    callbacks: {
        async jwt({ token, user }) {
            token._id = user._id?.toString()
            token.email=user.email
            return token
        },
        async session({ session, token,user}) {
            if(token){
                session.user._id=user._id   
            }
            return session

        }

    },
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-out',
    }, session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}