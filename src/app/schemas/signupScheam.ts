import {z} from 'zod'

const usernameValidation=z.string()
                        .min(4,"Usename minimum 4 charecter")
                        .max(10,"Username with in 10 charecters")
            
const emailValidation=z.string()
                      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email address")

const passwordValidation=z.string()
                         .min(6,"Password must be 6 charecter")
                         .max(10,"Password with in 10 charecters")
                         
//SignupScheam validation
export const SignupScheamValidation=z.object({
    username:usernameValidation,
    email:emailValidation,
    password:passwordValidation

})