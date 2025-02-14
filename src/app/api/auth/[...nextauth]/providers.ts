import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions, User } from "next-auth"
import dbConnect from "@/app/lib/db";
import bcrypt from "bcryptjs"
import UserModel from "@/app/models/user";
import axios from "axios";
export const AuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials): Promise<User| null>{
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
                    const comparePassword =user.password? await bcrypt.compare(credentials.password, user.password):false
                    if (!comparePassword) {
                        throw new Error("invalid credentials.. ok")
                    }
                    console.log("✅ User authenticated:", user.email);  //Todo remove
                    return user as User

                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error("Authentication failed");
                }

            }
        }),

    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user){
            token._id = user._id?.toString()
            token.email=user.email
            token.username=user.username
            }
            return token;
        },
        async session({ session, token}) {
            if(token){
                session.user = {
                    _id: token._id as string,
                    email: token.email as string,
                    username: token.username as string, // Ensure username is assigned
                };
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