import z from "zod";

export const signUpValidateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const signInValidateSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
