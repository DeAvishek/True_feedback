import {verifyCodeVAlidation} from '@/app/schemas/verifycodeScheam'
import {usernameValidation} from '@/app/schemas/signupScheam'
import dbConnect from '@/app/lib/db'
import UserModel from '@/app/models/user'



export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,verifyCode}= await request.json();

         // Parse the username and verify code using Zod schema
        const UserName=usernameValidation.parse(username)
        const OTP=verifyCodeVAlidation.parse(verifyCode)

        //database query
        const user=await UserModel.findOne({username})
        if(!user){
            return new Response(JSON.stringify({success:false,message:"User not found"}),{status:500})
        }

        // console.log(UserName)
        // console.log(user.verifyCode)
        // console.log(OTP)
        const isOtpMatch=OTP==user.verifyCode
        const isNotverifyCodeExpire=user.verifyCodeExpiry>new Date;
        if(isOtpMatch && isNotverifyCodeExpire){
            user.isVerified=true;
            await user.save()
        }else if(!isOtpMatch){
            return new Response(JSON.stringify({success:false,message:"Please submit a correct otp"}),{status:500})
        }else{
            const expDate=new Date()
            expDate.setHours(expDate.getHours()+1)
            user.verifyCodeExpiry=expDate;
            user.isVerified=true
            await user.save()
        }
        return new Response(JSON.stringify({success:true,message:"User verified successfully"}),{status:200})
        
        
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({success:false,message:"Error occour during verify code"}),{status:500})
    }


}