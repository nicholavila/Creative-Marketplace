"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas/auth/auth";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail, updateUserToken } from "@/data/user";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const verificationToken = generateVerificationToken(existingUser.userId);

  const updatedUser = await updateUserToken({
    userId: existingUser.userId,
    verificationToken,
    expires: new Date(new Date().getTime() + 3600 * 1000)
  });

  if (!updatedUser) {
    return { error: "Server Error" };
  }

  // const passwordResetToken = await generatePasswordResetToken(email);
  const response = await sendPasswordResetEmail(
    updatedUser.email,
    updatedUser.verificationToken
  );

  if (response.error) {
    return { error: "Error occurred while sending reset email" };
  }

  return { success: "Reset email sent!" };
};
