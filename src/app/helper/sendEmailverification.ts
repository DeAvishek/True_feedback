import Email from "../../../emails/emailTemplate1";
import { resend_key } from "../lib/resend";

 async function emailSend(username:string,email:string,verifyCode:string){
        try {
            const { data, error } = await resend_key.emails.send({
              from: 'onboarding@resend.dev>',
              to: email,
              subject: 'Hello world',
              react: Email({username,otp:verifyCode}),
            });
            if (error) {
                return Response.json({ error }, { status: 500 });
              }
              return Response.json(data);
    } catch (emialError) {
        console.log(emialError);
        return ({success:false,message:"Failed to send verification email"})
    }
}

export default emailSend