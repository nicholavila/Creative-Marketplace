import * as z from "zod";

// for `Set New Password` Form
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Passwords must be at least 6 characters long"
  })
});

// for `Send Reset Password email` Form
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email"
  })
});

// for `Login` Form
export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, "Passwords must be at least 6 characters long")
    .max(32, "Passwords must be a maximum of 32 characters"),
  code: z.optional(z.string())
});

// for `Signup` Form
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, "Passwords must be at least 6 characters long")
    .max(32, "Passwords must be a maximum of 32 characters"),
  name: z
    .string()
    .min(1, "A name is required")
    .max(72, "Name must be a maximum of 72 characters")
});

// for `Creator Registration` Form
export const CreatorRegisterSchema = z.object({
  isCreator: z.boolean(),
  isAffiliate: z.boolean(),
  isCustomer: z.boolean(),
  username: z
    .string()
    .min(1, "A name is required")
    .max(72, "Name must be a maximum of 72 characters"),
  bio: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters long" })
    .max(160, { message: "Bio must be a maximum of 160 characters" })
});
