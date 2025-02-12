import { getServerSession } from "next-auth/next"
import { AuthOptions } from "@/app/api/auth/[...nextauth]/providers"
import dbConnect from "@/app/lib/db"
import UserModel from "@/app/models/user"
import mongoose from "mongoose"

export async function POST(request: Request) {
    const session = await getServerSession(AuthOptions)
    if (!session || !session.user || !session.user._id) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized access" }), { status: 401 });
    }
    try {
        await dbConnect()
        const UserId = session?.user._id
        const UserIdobject=new mongoose.Types.ObjectId(UserId)
        const user = await UserModel.findOne({ _id: UserIdobject })
        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 401 })
        }
        if (!user.isVerified) {
            return new Response(JSON.stringify({ success: false, message: "User not authorized" }), { status: 401 })
        }

        user.isAcceptingMessage=!user.isAcceptingMessage
        await user.save()
        return new Response(JSON.stringify({ success: true, message: "Accepting message status updated successfully" }), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error || "Internal server error" }), { status: 500 })
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(AuthOptions)
    if (!session || !session.user || !session.user._id) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized access" }), { status: 401 });
    }
    try {
        await dbConnect()
        const UserId = session?.user._id
        const user = await UserModel.findOne({ _id: UserId })
        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 401 })
        }
        if (!user.isVerified) {
            return new Response(JSON.stringify({ success: false, message: "User not authorized" }), { status: 401 })
        }
        
        const isAcceptingMessage=user.isAcceptingMessage
        return new Response(JSON.stringify({ success: true, AcceptMessage:isAcceptingMessage }), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error ||"Internal server error" }), { status: 500 })
    }
}