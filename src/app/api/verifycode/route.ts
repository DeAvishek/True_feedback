import{verifyCodeValidation} from '@/app/schemas/verifycodeScheam'
import dbConnect from '@/app/lib/db';
import UserModel from '@/app/models/user';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const username = body.username;
    const verifyCode = body['verify-code'];

    // Parse inputs
    const OTP = verifyCodeValidation.parse(verifyCode);

    // Database check
    const user = await UserModel.findOne({ username});
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "User not found" 
      }), { status: 404 });
    }

    // Verify code logic
    const isOtpMatch = OTP === user.verifyCode;
    const isNotverifyCodeExpire = user.verifyCodeExpiry > new Date();

    if (isOtpMatch && isNotverifyCodeExpire) {
      user.isVerified = true;
      await user.save();
      return new Response(JSON.stringify({
        success: true,
        message: "User verified successfully"
      }), { status: 200 });
    }

    else if (!isOtpMatch) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid verification code"
      }), { status: 400 });
    }

    // Handle expired code
    else{
        const expdate=new Date
        expdate.setHours(expdate.getHours()+1)
        user.isVerified=true;
        user.verifyCodeExpiry=expdate
        await user.save()
        return new Response(JSON.stringify({
            success: true,
            message: "User verified successfully"
          }), { status: 200 });
    }
    

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: "Error during verification process"
    }), { status: 500 });
  }
}