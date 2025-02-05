import NextAuth from "next-auth/next";
import {AuthOptions} from '@/app/api/auth/[...nextauth]/providers'

const handler=NextAuth(AuthOptions)

export {handler as GET ,handler as POST}