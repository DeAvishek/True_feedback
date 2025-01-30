import { z } from "zod";

export const verifyCodeValidation = z.string()
  .min(6, "Verification code must be 6 characters")
  .max(6, "Verification code must be 6 characters")
  .regex(/^\d+$/, "Must contain only numbers");

  export const formSchema = z.object({
    'verify-code': verifyCodeValidation // Proper object schema structure
  });