import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import dbConnect from "@/app/lib/db";
import bcrypt from "bcryptjs"
import UserModel from "@/app/models/user";
export const AuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials): Promise<any> {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Email and password are required");
                }
                await dbConnect()  //connect database
                try {
                    const userDoc = await UserModel.findOne({ email: credentials.email })
                    if (!userDoc) {
                        console.log("❌ User not found:", credentials.email);  //Todo remove
                        throw new Error("User not found")
                    }
                    const user = userDoc.toObject();
                    if (!user.isVerified) {
                        console.log("❌ User not verified:", user.email);   //Todo remove
                        throw new Error("Please verify your account first")
                    }
                    const comparePassword = await bcrypt.compare(credentials.password, user.password)
                    if (!comparePassword) {
                        throw new Error("invalid credentials.. ok")
                    }
                    console.log("✅ User authenticated:", user.email);  //Todo remove
                    return user

                } catch (error: any) {
                    throw new Error(error.message || "Authentication failed");
                }

            }
        }),

    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user){
            token._id = user._id?.toString()
            token.email=user.email
            }
            return token;
        },
        async session({ session, token }) {
            if(token){
            session.user._id=token._id as string
            session.user.email=token.email as string
            }
            return session
        }

    },
    pages: {
        signIn: `/sign-in`,
        signOut: '/sign-out',
    }, session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}