"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { PaymentPrefSchema } from "@/schemas/user";

import { GradientButton } from "../utils/gradient-button";

export const PaymentPrefForm = () => {
  // const [error, setError] = useState<string | undefined>("");
  // const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof PaymentPrefSchema>>({
    resolver: zodResolver(PaymentPrefSchema),
    defaultValues: {
      paypal: "",
      cashapp: "",
      venmo: "",
      zelle: "",
      applepay: "",
      googlepay: "",
      amazonpay: ""
    }
  });

  const onSubmit = (values: z.infer<typeof PaymentPrefSchema>) => {
    // setError("");
    // setSuccess("");

    startTransition(() => {
      console.log(values);
    });
  };

  return (
    <Card className="w-full h-fit flex flex-col">
      <CardHeader>
        <CardTitle>Payment Pref</CardTitle>
        <CardDescription>
          You can select your Payment preference
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <CardContent className="flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="paypal"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Bitcoin</FormLabel>
                    <FormControl className="w-5/6">
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cashapp"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Ethereum</FormLabel>
                    <FormControl className="w-5/6">
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venmo"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Litecoin</FormLabel>
                    <FormControl className="w-5/6">
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zelle"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Dogecoin</FormLabel>
                    <FormControl className="w-5/6">
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applepay"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>XRP</FormLabel>
                    <FormControl className="w-5/6">
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="googlepay"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>SOL</FormLabel>
                    <FormControl className="w-5/6">
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amazonpay"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>USDcoin</FormLabel>
                    <FormControl className="w-5/6">
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </form>
      </Form>
      <CardFooter className="self-end">
        <GradientButton className="w-64 flex gap-x-2">Update</GradientButton>
      </CardFooter>
    </Card>
  );
};
