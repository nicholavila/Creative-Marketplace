import { zodResolver } from "@hookform/resolvers/zod";

import { useAtom } from "jotai";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaKey } from "react-icons/fa";
import { z } from "zod";

import { updatePassword } from "@/actions/auth/update-password";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/utils/form-error";
import { FormSuccess } from "@/components/utils/form-success";
import { PasswordChangeSchema } from "@/schemas/auth/auth";
import { userAtom } from "@/store/user";

import { GradientButton } from "../utils/gradient-button";

export const PasswordChangeForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const [user] = useAtom(userAtom);

  const form = useForm<z.infer<typeof PasswordChangeSchema>>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (values: z.infer<typeof PasswordChangeSchema>) => {
    setError("");
    setSuccess("");

    if (values.newPassword !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    startTransition(() => {
      updatePassword(user?.userId as string, values).then((response) => {
        setSuccess(response.success);
        setError(response.error);
      });
    });
  };

  return (
    <Card className="w-full h-fit rounded-3xl font-firs">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          {`It's recommended to update your password regularly for security`}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <CardContent className="flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
          </CardContent>
          <CardFooter>
            <GradientButton
              disabled={isPending}
              type="submit"
              variant="default"
              className="w-64 gap-x-2"
            >
              <FaKey />
              Change Password
            </GradientButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
