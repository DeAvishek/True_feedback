import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/user";
import { getServerSession } from "next-auth/next";
import {AuthOptions } from "@/app/api/auth/[...nextauth]/providers";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const url=new URL(request.url)
    const messageId=url.pathname.split("/").pop()
    const session = await getServerSession(AuthOptions);

    if (!session || !session.user || !session.user._id) {
        return new NextResponse(JSON.stringify({ success: false, message: "No user found" }), { status: 401 });
    }

    try {
        await dbConnect();

        const userId = new mongoose.Types.ObjectId(session.user._id);
        const messageObjectId = new mongoose.Types.ObjectId(messageId);

        const updatedResult = await UserModel.updateOne(
            { _id: userId },
            { $pull: { message: { _id: messageObjectId } } }
        );

        if (updatedResult.modifiedCount === 0) {
            console.log(userId); // TODO: Remove later
            console.log("No messages found to delete"); // TODO: Remove later

            return new NextResponse(JSON.stringify(
                { success: false, message: "No message found" }),
                { status: 404 }
            );
        }

        return new NextResponse(JSON.stringify(
            { success: true, message: "Message deleted successfully" }),
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Error deleting message:", error); // Logs error for debugging

        return new NextResponse(JSON.stringify(
            { success: false, message: "Internal server error" }),
            { status: 500 }
        );
    }
}
