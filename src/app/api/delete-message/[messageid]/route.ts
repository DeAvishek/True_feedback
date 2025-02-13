import dbConnect from "@/app/lib/db"
import UserModel from "@/app/models/user"
import { getServerSession } from "next-auth/next"
import { AuthOptions } from "@/app/api/auth/[...nextauth]/providers"
import mongoose from "mongoose"


export async function DELETE(request: Request,{params}:{params:{messageid:string}}) {
    const messageId=await params.messageid
    const session = await getServerSession(AuthOptions)
    if (!session || !session.user || !session.user._id) {
        return new Response(JSON.stringify({ success: false, message: "No user found" }), { status: 401 });
    }
    try {
        await dbConnect()

        const UserId = new mongoose.Types.ObjectId(session.user._id)
        const messageObjectId=new mongoose.Types.ObjectId(messageId)
        const upadatedResult = await UserModel.updateOne(
            {_id:UserId},
            { $pull: { message: { _id: messageObjectId } } }
        )
        if(upadatedResult.modifiedCount===0){
            console.log(UserId)  //todo to remove
            console.log("i am from upadatedResult.modifiedCount===0")  //todo to remove
            return new Response(JSON.stringify(
                { success: false, message: "No Message Found" }),
                 { status: 401 });
        }
        return new Response(JSON.stringify(
            { success: true, message: "Message deleted successfully" }),
            { status: 200 }
        );

    } catch (error:unknown) {
            return new Response(JSON.stringify(
                { success: false, message:"internal server error" }),
                { status: 500 });
        
    }


}