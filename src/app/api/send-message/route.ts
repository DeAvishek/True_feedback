import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/user";
import MessageModel from "@/app/models/message";
import {IMessage} from "@/app/models/message"
import { messageValidation } from "@/app/schemas/messageScheam";
export async function POST(request:Request){
    const {username,content}=await request.json()
    const ValidateContent=messageValidation.parse(content)

    try {
        await dbConnect()
        const user= await UserModel.findOne({username:username})
        if(!user){
            return new Response(JSON.stringify({status:false,message:"User not found"}),{status:404})
        }
        if(!user.isAcceptingMessage){
            return new Response(
                JSON.stringify({
                    success:false,
                    message:"User is Not accepting messages"
                }),{
                    status:400
                }
            )
        }
        const message=new MessageModel({
            content:ValidateContent
        })
        await message.save()
        user.message.push(message as IMessage)
        await user.save()
        return new Response(JSON.stringify({success:true,message:"Message send successfully"}),{status:200})
    } catch (error:any) {
        const errorMessage =
        error.name === "ZodError"
        ? error.errors.map((e: any) => e.message).join(", ")
        : error.message || "Internal server error";
        return new Response(JSON.stringify({ success: false, message:errorMessage }), { status: 500 })
    }

}