import { useAtom } from "jotai";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { userAtom } from "@/store/user";

import { GradientButton } from "../utils/gradient-button";
import { GradientParagraph } from "../utils/gradient-paragraph";

import { LinkedSites } from "./linked-sites";

import type { Address, Company, User } from "@/shared/types/user.type";

type PropsParams = {
  userData: User | undefined;
};

export const AboutCreator = ({ userData }: PropsParams) => {
  const [user] = useAtom(userAtom);
  const creator = userData?.creator;

  return (
    <Card className="border-0">
      <CardHeader className="flex flex-row items-end justify-between">
        <GradientParagraph className="text-xl font-bold">
          About the Creator
        </GradientParagraph>
        {user?.userId === userData?.userId && (
          <GradientButton variant="default" asChild>
            <Link href="/user/creator" className="flex gap-x-1">
              <FaEdit /> Edit
            </Link>
          </GradientButton>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-between">
          <div className="w-1/2 flex flex-col gap-y-12">
            <div className="flex flex-col gap-y-4">
              <p className="text-sky-700 font-medium">
                ** Scraped data will be pre-populated here. **
              </p>
              <p>
                creatorId:{" "}
                <span className="font-semibold">
                  {creator?.creatorId || ""}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex gap-x-4 items-center">
                <GradientParagraph className="font-bold">
                  {`${userData?.firstname || ""} ${userData?.lastname || ""}`}
                </GradientParagraph>
                {creator?.jobTitle ? (
                  <Separator orientation={"vertical"} />
                ) : null}
                <p className="font-semibold">{creator?.jobTitle}</p>
              </div>
              <p className="text-gray-700">{creator?.bio}</p>
            </div>
            <div className="flex flex-col gap-y-4">
              <GradientParagraph className="text-xl font-semibold">
                Contact
              </GradientParagraph>
              <div className="flex flex-col gap-y-4">
                <CompanyShow company={creator?.company} />
                <AddressShow address={userData?.address} />
                {userData?.phone1 && (
                  <p>
                    Phone 1:{" "}
                    <span className="font-semibold">{userData.phone1}</span>
                  </p>
                )}
                {userData?.phone2 && (
                  <p>
                    Phone 2:{" "}
                    <span className="font-semibold">{userData.phone2}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-2/5 flex flex-col gap-y-6">
            <GradientParagraph className="text-xl font-medium">
              {`Creator's profiles on other Creative markets`}
            </GradientParagraph>
            <LinkedSites disabled showButton={false} />
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

const AddressShow = ({ address }: { address: Address | undefined }) => {
  if (!address) {
    return null;
  }

  return (
    <div className="flex gap-x-2">
      <p>Address:</p>
      <div className="flex gap-x-2 font-semibold">
        <p>{`${address.address1 ? address.address1 + "," : ""}`}</p>
        <p>{`${address.address2 ? address.address2 + "," : ""}`}</p>
        <p>{`${address.city ? address.city + "," : ""}`}</p>
        <p>{`${address.postal ? address.postal + "," : ""}`}</p>
        <p>{address.country || ""}</p>
      </div>
    </div>
  );
};

const CompanyShow = ({ company }: { company: Company | undefined }) => {
  if (!company) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-4">
      <p>Company:</p>
      {company.website ? (
        <Button variant="link" className="p-0 text-md">
          <Link href={company.website}>
            {company.name ? company.name : company.website}
          </Link>
        </Button>
      ) : (
        <p className="font-semibold">{company.name || ""}</p>
      )}
      {company.country && (
        <div className="flex gap-x-2">
          <p>in</p>
          <p>{company.country}</p>
        </div>
      )}
    </div>
  );
};
