import { Resend } from "resend";
export const resend_key = new Resend(process.env.RESEND_API_KEY);