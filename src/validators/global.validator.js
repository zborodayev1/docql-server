import z from "zod";

export const idValidatorSchema = z.object({
  id: z.string().min(1, "Id is required"),
});
