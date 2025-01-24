import mongoose,{Schema,Document} from "mongoose";
import { IMessage } from './message'
import { MessageSchema } from "./message";
export interface IUser extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    message:[IMessage]
}
//define the type of Message schema
const UserSchema:Schema<IUser>=new Schema({
    username:{
        type:String,
        required:[true ,"Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please enter a valid email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    verifyCode:{
        type:String,
        required:true,
        unique:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        required:true,
        default:true
    },
    message:[MessageSchema]
})

const UserModel=(mongoose.models.User as mongoose.Model<IUser>) || (mongoose.model<IUser>("User",UserSchema))
export default UserModel