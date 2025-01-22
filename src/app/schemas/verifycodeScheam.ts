import { z } from "zod";

export const verifyCodeVAlidation=z.string()
                           .length(6,"verify code must be 6 charecter long")