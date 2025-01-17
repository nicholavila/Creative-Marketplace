"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
// import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/utils/form-error";
import { FormSuccess } from "@/components/utils/form-success";
import { updateCreatorData } from "@/data/user";
import { useLinkFromS3 } from "@/hooks/use-link-from-s3";
import { CreatorSettingsSchema } from "@/schemas/auth/auth";
import { JOB_TITLES } from "@/shared/constants/user.constant";
import { uploadImage } from "@/shared/functions/upload-image";
import { CreatorData, User } from "@/shared/types/user.type";
import { userAtom } from "@/store/user";

import { GradientButton } from "../utils/gradient-button";

export default function EditCreator({
  disabled = false
}: {
  disabled?: boolean;
}) {
  const [user, setUser] = useAtom(userAtom);
  const { getLinkFromS3 } = useLinkFromS3();

  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, setPending] = useState<boolean>(false);
  const [isChanged, setChanged] = useState<boolean>(false);

  const [cover, setCover] = useState<File>();
  const [coverImagePath, setCoverImagePath] = useState<string>();

  useEffect(() => {
    if (!user || !getLinkFromS3) return;

    if (user?.creator?.cover) {
      getLinkFromS3(user.creator.cover, "LISTING").then((res) => {
        if (res.success) {
          setCoverImagePath(res.response as string);
        }
      });
    }
  }, [user, getLinkFromS3]);

  const hiddenCoverFileInput = useRef<HTMLInputElement>(null);
  const onCoverChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImagePath(URL.createObjectURL(e.target.files[0]));
      setCover(e?.target?.files?.[0]);

      setError("");
      setSuccess("");
      setChanged(true);
    }
  };

  const isDisabled = useMemo(() => {
    return isPending || disabled;
  }, [isPending, disabled]);

  const form = useForm<z.infer<typeof CreatorSettingsSchema>>({
    resolver: zodResolver(CreatorSettingsSchema),
    defaultValues: {
      cover: user?.creator?.bio,
      username: user?.username,
      email: user?.email,
      bio: user?.creator?.bio,
      jobTitle: user?.creator?.jobTitle,
      companyTitle: user?.creator?.company?.name,
      companyWebsite: user?.creator?.company?.website,
      companyCountry: user?.creator?.company?.country,
      website1: user?.creator?.websites?.[0],
      website2: user?.creator?.websites?.[1],
      website3: user?.creator?.websites?.[2],
      website4: user?.creator?.websites?.[3],
      website5: user?.creator?.websites?.[4]
    }
  });

  const isFormChanged = () => {
    const _changed =
      user?.creator?.bio !== form.getValues("bio") ||
      user?.creator?.jobTitle !== form.getValues("jobTitle") ||
      user?.creator?.company?.name !== form.getValues("companyTitle") ||
      user?.creator?.company?.website !== form.getValues("companyWebsite") ||
      user?.creator?.company?.country !== form.getValues("companyCountry") ||
      user?.creator?.websites?.[0] !== form.getValues("website1") ||
      user?.creator?.websites?.[1] !== form.getValues("website2") ||
      user?.creator?.websites?.[2] !== form.getValues("website3") ||
      user?.creator?.websites?.[3] !== form.getValues("website4") ||
      user?.creator?.websites?.[4] !== form.getValues("website5");

    if (_changed) {
      setError("");
      setSuccess("");
    }

    return _changed;
  };

  form.watch(() => {
    setChanged(isFormChanged() || !!cover);
  });

  const updateData = async (values: z.infer<typeof CreatorSettingsSchema>) => {
    if (cover) {
      const keyName = `${user?.username}/${uuidv4()}`;
      if (await uploadImage(cover, keyName)) {
        values.cover = keyName;
      } else {
        setError("Failed to upload image");
        return null;
      }
    }

    const creatorData = {
      ...user?.creator,
      cover: values.cover,
      bio: values.bio,
      jobTitle: values.jobTitle,
      company: {
        name: values.companyTitle,
        website: values.companyWebsite,
        country: values.companyCountry
      },
      websites: [
        values.website1,
        values.website2,
        values.website3,
        values.website4,
        values.website5
      ]
    } as CreatorData;

    const response = await updateCreatorData({
      userId: user?.userId as string,
      creatorData
    });

    if (response.success) {
      setSuccess("Profile updated successfully");
      return creatorData;
    } else {
      setError("Failed to update profile");
      return null;
    }
  };

  const onSubmit = (values: z.infer<typeof CreatorSettingsSchema>) => {
    setError("");
    setSuccess("");

    setPending(true);
    updateData(values).then((creatorData) => {
      if (creatorData) {
        setUser({
          ...user,
          creator: creatorData
        } as User);
      }
      setCover(undefined);
      setPending(false);
      setChanged(false);
    });
  };

  return (
    <main className="w-full flex justify-between">
      <div className="w-[640px] flex flex-col gap-y-6">
        {/* <div className="flex items-center gap-x-4">
          <Button asChild variant="link" className="px-0">
            <Link href="/">Accept our standard Legal Agreements</Link>
          </Button>
          <Switch disabled={isDisabled} />
        </div> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6 font-firs"
          >
            <div className="w-full flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-4">
                <FormLabel>Cover Image & Avatar</FormLabel>
                <Avatar className="w-full h-28 rounded-3xl">
                  <AvatarImage src={coverImagePath} className="object-cover" />
                  <AvatarFallback className="bg-sky-500">
                    <div className="w-full h-full rounded-3xl bg-inherit"></div>
                  </AvatarFallback>
                </Avatar>
                <GradientButton
                  disabled={isPending}
                  className="py-1 w-fit"
                  onClick={() => hiddenCoverFileInput.current?.click()}
                >
                  Upload New
                </GradientButton>
                <Input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  ref={hiddenCoverFileInput}
                  onChange={onCoverChanged}
                />
              </div>
              <div className="w-full flex items-end gap-x-6">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            placeholder="JohnDoe1234"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            placeholder="username@yemail.com"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isDisabled}
                        placeholder="JohnDoe1234"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of User</FormLabel>
                    <Select
                      disabled={isDisabled}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select what you join for" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TITLES.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex items-end gap-x-6">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="companyTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Company</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isDisabled}
                          placeholder="Company title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isDisabled}
                          placeholder="Company website"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-1/2 pr-3">
              <FormField
                control={form.control}
                name="companyCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isDisabled}
                        placeholder="Company country"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex items-end gap-x-6">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="website1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Personal Websites</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Website 1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="website2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} placeholder="Website 2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full flex items-end gap-x-6">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="website3"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} placeholder="Website 3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="website4"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} placeholder="Website 4" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-1/2 pr-3">
              <FormField
                control={form.control}
                name="website5"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} placeholder="Website 5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />
            <GradientButton
              disabled={isDisabled || !isChanged}
              className="w-64"
              type="submit"
            >
              Save Profile
            </GradientButton>
          </form>
        </Form>
      </div>
    </main>
  );
}
