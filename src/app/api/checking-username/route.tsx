import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/user";

export async function GET(request:Request){
    const {searchParams}=new URL(request.url)
    let UserName=searchParams.get('username')
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
                    message:"no user exists"
                }),{
                    status:200
                })
            }
        }
        return new Response(JSON.stringify({
            success:true,
            message:"no user exists"
        }),{
            status:200
        })
        
    } catch (error:any) {
        console.error("Error checking username:", error.message || error);
        return new Response(JSON.stringify({
            success: false,
            message: error ||"Internal server error."
        }), { status: 500 });
    }
}