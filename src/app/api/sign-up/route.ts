import UserModel from "@/app/models/user";
import dbConnect from "@/app/lib/db";
import bcrypt from "bcryptjs";
import emailSend from "@/app/helper/sendEmailverification";


export async function POST(request: Request) {
    await dbConnect()//database connection establish
    try {
        const { username, email, password } = await request.json()//get request bodies data
        const existing_User_By_UserName = await UserModel.findOne({ username })

        if (existing_User_By_UserName) {
            return new Response(JSON.stringify({ success: false, message: "Username is already taken" }), { status: 400 })
        }
        const existing_User_By_Email = await UserModel.findOne({ email })
        if (existing_User_By_Email) {
            if (existing_User_By_Email.isVerified) {
                return Response.json({ success: false, message: "Username with email exists" }, { status: 400 })
            } else {
                const hashPassword = await bcrypt.hash(password, 10)
                const expDate = new Date()
                expDate.setHours(expDate.getHours() + 1)
                const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
                existing_User_By_Email.password = hashPassword;
                existing_User_By_Email.verifyCode = verifyCode;
                existing_User_By_Email.verifyCodeExpiry = expDate;

                await existing_User_By_Email.save()
                
                const eamilResponse = await emailSend(username, email, verifyCode)
                if (!eamilResponse) {
                    return Response.json({ success: false, message: "failed to send verification email" }, { status: 500 })
                }
                return Response.json({ success: true, messgae: "Accout created successfully please verify your email" }, { status: 201 })
            }

        }
        const hashPassword = await bcrypt.hash(password, 10)
        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
        const expDate = new Date()
        expDate.setHours(expDate.getHours() + 1)
        const newUser = new UserModel({
            username,
            email,
            password: hashPassword,
            verifyCode: verifyCode,
            verifyCodeExpiry: expDate,
            isVerified: false,
            isAcceptingMessage: true,
            message: []
        })
        await newUser.save()

        const eamilResponse = await emailSend(username, email, verifyCode)
        if (!eamilResponse) {
            return Response.json({ success: false, message: "failed to send verification email" }, { status: 500 })
        }
        return Response.json({ success: true, messgae: "Accout created successfully please verify your email" }, { status: 201 })

    }
    catch (error) {
        return Response.json({
            success: false, message: "Server error while creating user"
        }, {
            status: 500
        })
    }

}