import UserModel from "@/app/models/user";
import dbConnect from "@/app/lib/db";
import bcrypt from "bcryptjs"
import emailSend from "@/app/helper/sendEmailverification";

export async function POST(request: Request) {
    await dbConnect()//database connection establish
    try {
        const { username, email, password } = await request.json()//get request bodies data
        const existing_User_By_UserName = await UserModel.findOne({ username,isVerified:true })

        if (existing_User_By_UserName) {
            return new Response(JSON.stringify({ success: false, message: "Username is already taken" }), { status: 400 })
        }
        const existing_User_By_Email = await UserModel.findOne({ email })
        if (existing_User_By_Email) {
            if (existing_User_By_Email.isVerified) {
                return new Response(JSON.stringify({ success: false, message: "Email is already taken and verified" }), { status: 400 })
            } else {
                const hashPassword = await bcrypt.hash(password, 10)
                const expDate = new Date()
                expDate.setHours(expDate.getHours() + 1)
                const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
                existing_User_By_Email.username=username
                existing_User_By_Email.password = hashPassword
                existing_User_By_Email.verifyCode = verifyCode;
                existing_User_By_Email.verifyCodeExpiry = expDate;

                await existing_User_By_Email.save()

                const eamilResponse = await emailSend(username, email, verifyCode)
                if (!eamilResponse) {
                    return new Response(JSON.stringify({ success: false, message: "Failed to send email verification" }), { status: 500 })
                }
                return new Response(JSON.stringify({ success: true, message: "Account created successfully verify email" }), { status: 201 })

            }
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expDate = new Date()
        expDate.setHours(expDate.getHours() + 1)
        const newUser = new UserModel({
            username,
            email,
            password:hashedPassword,
            verifyCode: verifyCode,
            verifyCodeExpiry: expDate,
            isVerified: false,
            isAcceptingMessage: true,
            message: []
        })
        await newUser.save()

        const eamilResponse = await emailSend(username, email, verifyCode)
        console.log(eamilResponse)
        if (!eamilResponse) {
            return new Response(
                JSON.stringify({ success: false, message: "Failed to send verification email" }),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify({ success: true, message: "Account created successfully please verify your email" }),
            { status: 201 }
        );
    }
    catch (error) {
        console.log(error)
        return new Response(
            JSON.stringify({ success: false, message: "Server error while creating user" }),
            { status: 500 }
        );
    }

}