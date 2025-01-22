import {z} from "zod"

export const SigninSchemaValidation=z.object({
    identifier:z.string().min(1,"Identifier is required"),
    password:z.string().min(1,"Password is required")
})