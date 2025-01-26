    import mongoose,{Schema,Document} from "mongoose";

    export  interface IMessage extends Document{
        content:string,
        createdAt:Date,

    }

    //define the type of Message schema
    export const MessageSchema:Schema<IMessage>=new Schema({
        content:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    })

    const MessageModel= mongoose.models.Message as mongoose.Model<IMessage>|| mongoose.model<IMessage>('Message',MessageSchema)
    export default MessageModel