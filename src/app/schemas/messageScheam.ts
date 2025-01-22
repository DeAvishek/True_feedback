import { z } from "zod";

export const messageValidation=z.string()
                               .max(200,"Content must be with in 200 charecters")
                               .min(1,"Content cannot be empty")