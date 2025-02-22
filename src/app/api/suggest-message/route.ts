import {GoogleGenerativeAI} from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()
const api_key=process.env.GENAI_API_KEY
// type ApiKey={
//     api_key:string
// }
const GenAi=new GoogleGenerativeAI(api_key || "undefined")

const model=GenAi.getGenerativeModel({model:"gemini-1.5-flash"})
export async function GET(){
    try {
        const prompt=`you are an AI assistant who suggest three interseting feedback messages with in 20 words(each message) by creating | between each`
        const result=await model.generateContent(prompt)
        if(result){
            return new Response(JSON.stringify({
                success:true,
                message:result.response.text()
            }),{
                status:200
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({
            success:false,
            message:error||"Internal server error"
        }),{
            status:500
        })
    }
}