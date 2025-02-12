import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/user";

export async function GET(request:Request){
    const {searchParams}=new URL(request.url)
    const UserName=searchParams.get('username')
    try {
        await dbConnect();
        const user=await UserModel.findOne({username:UserName})
        if(user){
            if(user.isVerified){
                return new Response(JSON.stringify({
                    success:false,
                    message:"User name is verified"
                }),{
                    status:400
                })
            }else{
                return new Response(JSON.stringify({
                    success:true,
                    message:"User name is exist but not verified"
                }),{
                    status:200
                })
            }
        }
        return new Response(JSON.stringify({
            success:true,
            message:"Username is unique"
        }),{
            status:200
        })
        
    } catch (error) {
        console.error("Error checking username:", error.message || error);
        return new Response(JSON.stringify({
            success: false,
            message: error ||"Internal server error."
        }), { status: 500 });
    }
}