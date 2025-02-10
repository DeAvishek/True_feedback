import { z } from "zod";
const isAcceptingMessageValidation=z.boolean()

export const accptingMessage=z.object({
    isAccepting:isAcceptingMessageValidation
})