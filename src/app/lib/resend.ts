
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
export const resend_key = new Resend(process.env.RESEND_API_KEY);
