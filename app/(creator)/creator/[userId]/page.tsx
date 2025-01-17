"use client";

import { useEffect, useState } from "react";

import { FaUser } from "react-icons/fa";

import { AboutCreator } from "@/components/profile/about-creator";
import { UserCollection } from "@/components/profile/user-collection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientButton } from "@/components/utils/gradient-button";
import { GradientParagraph } from "@/components/utils/gradient-paragraph";

import { getProductById } from "@/data/product";
import { getUserById } from "@/data/user";

import { useLinkFromS3 } from "@/hooks/use-link-from-s3";

import type { Product, ProductLink } from "@/shared/types/product.type";
import type { User } from "@/shared/types/user.type";

interface PropsParams {
  params: {
    userId: string;
  };
}

export default function CreatorProfile({ params: { userId } }: PropsParams) {
  const { getLinkFromS3 } = useLinkFromS3();
  const [userData, setUserData] = useState<User>();
  const [avatarPath, setAvatarPath] = useState<string>("");
  const [coverPath, setCoverPath] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    getUserById(userId).then((_userData) => {
      if (!_userData) {
        return;
      }

      setUserData(_userData);
      if (_userData.avatar) {
        getLinkFromS3(_userData.avatar, "LISTING").then((res) => {
          if (res.success) {
            setAvatarPath(res.response as string);
          }
        });
      }
      if (_userData.creator?.cover) {
        getLinkFromS3(_userData.creator.cover, "LISTING").then((res) => {
          if (res.success) {
            setCoverPath(res.response as string);
          }
        });
      }
      if (_userData.creator?.products) {
        _userData.creator.products.map((item: ProductLink) => {
          getProductById(item.productType, item.productId).then((_product) => {
            if (_product) {
              setProducts((prev) => [...prev, _product]);
            }
          });
        });
      }
    });
  };

  const onFollow = () => {};

  return (
    <div className="w-5/6 flex flex-col items-center gap-y-2 pt-6 pb-24">
      <div className="relative w-full flex flex-col items-center mb-12">
        <Avatar className="w-full h-56 rounded-3xl">
          <AvatarImage src={coverPath} className="object-cover" />
          <AvatarFallback className="bg-sky-500">
            <div className="w-full h-full bg-inherit"></div>
          </AvatarFallback>
        </Avatar>
        <div className="absolute w-24 h-24 bottom-[-48px] border-4 border-white bg-white rounded-full">
          <Avatar className="w-full h-full">
            <AvatarImage src={avatarPath} />
            <AvatarFallback className="bg-sky-500">
              <FaUser className="text-white" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-y-3 font-firs">
        {/* <p className="text-xl font-bold">@{userData?.username}</p> */}
        <GradientParagraph className="text-xl font-bold">
          @{userData?.userId}
        </GradientParagraph>
        <GradientParagraph className="text-xl font-bold text-rose-700">
          ★ ★ ★ ★ ★
        </GradientParagraph>
        <GradientParagraph className="text-lg font-bold">{`${userData?.firstname || ""} ${userData?.lastname || ""}`}</GradientParagraph>
        <div className="flex gap-x-6">
          <GradientButton variant="default" className="w-24" onClick={onFollow}>
            Follow
          </GradientButton>
          <GradientButton className="w-24">Message</GradientButton>
        </div>
      </div>
      <div className="w-full flex flex-col items-center pt-6">
        <Tabs defaultValue="Collection" className="w-full font-firs">
          <TabsList className="w-full px-6 py-2 h-fit flex justify-start gap-x-16">
            <TabsTrigger value="Collection">
              <p className="text-base">Collection</p>
            </TabsTrigger>
            <TabsTrigger value="About">
              <p className="text-base">About</p>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Collection">
            <UserCollection products={products} userId={userId} />
          </TabsContent>
          <TabsContent value="About">
            <AboutCreator userData={userData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
