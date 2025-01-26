import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/user";
import {IMessage} from "@/app/models/message"
import { messageValidation } from "@/app/schemas/messageScheam";
export async function POST(request:Request){
    const {username,content}=await request.json()
    const Content=messageValidation.parse(content)

    try {
        await dbConnect()
        const user= await UserModel.findOne({username:username})
        if(!user){
            return new Response(JSON.stringify({status:false,message:"User not founs"}),{status:404})
        }
        const message={
            content:Content,
            createdAt:new Date
        }
        user.message.push(message as IMessage)
        await user.save()
        return new Response(JSON.stringify({success:true,message:"Message send successfully"}))
    } catch (error:any) {
        return new Response(JSON.stringify({ success: false, message:error.message ||"internal server error" }), { status: 500 })
    }

}