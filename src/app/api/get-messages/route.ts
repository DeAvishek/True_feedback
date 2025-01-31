import dbConnect from "@/app/lib/db"
import UserModel from "@/app/models/user"
import { getServerSession } from "next-auth/next"
import { AuthOptions } from "@/app/lib/auth"
import mongoose from "mongoose"

export async function GET(){
    const session = await getServerSession(AuthOptions)
    if (!session || !session.user || !session.user._id) {
        return new Response(JSON.stringify({ success: false, message: "No  user found" }), { status: 401 });
    }
    try {
        await dbConnect()
        const UserId=new mongoose.Types.ObjectId(session.user._id)  //userId casting
        const response=await UserModel.aggregate(
            [
                {
                    $match:{
                           _id:UserId,
                           message: { $exists: true, $ne: [] }  //if message exits
                           }
                },
                {$unwind:"$message"},
                {$sort:{'message.createdAt':1}},
                {
                    $group:{
                          _id:"$_id",
                           messages:{$push:"$message"}
                           }
                }
            ]
        )
        if(!response || response.length<=0){
            return new Response(JSON.stringify({success:true,message:"No message found"}),{status:204})
        }
        return new Response(JSON.stringify({success:true,result:response[0].messages}),{status:200})

        
    } catch (error:any) {
        return new Response(JSON.stringify({ success: false, message:error.message ||"internal server error" }), { status: 500 })
    }
}