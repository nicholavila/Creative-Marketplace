"use client";

import { useState } from "react";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import { register } from "@/actions/auth/register/register";
import { Button } from "@/components/ui/button";
import { ConfirmAlert } from "@/components/utils/confirm-alert";
import { getUserFromGeneralDetails } from "@/shared/functions/user-from-signup";
import { SignedUpData } from "@/shared/types/signup-data.type";
// import { uploadImage } from "@/shared/functions/upload-image";

type Props = {
  userData: SignedUpData;
  handleNext: () => void;
  handleBack: () => void;
};

export const CreatorCompleteForm = ({
  userData,
  handleNext,
  handleBack
}: Props) => {
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [isConfirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmTitle, setConfirmTitle] = useState<string>("");
  const [confirmMessage, setConfirmMessage] = useState<string>("");

  const processUserData = async () => {
    // # Scraped Data #

    const user = await getUserFromGeneralDetails(userData.generalDetails);
    user.creator = {
      isCreator: true,
      creatorId: uuidv4(),
      bio: userData.creatorDetails.bio,
      jobTitle: userData.creatorDetails.jobTitle,
      websites: []
    };

    // if (userData.creatorDetails.cover) {
    //   const keyName = `${userData.generalDetails.username}/${uuidv4()}`;
    //   if (await uploadImage(userData.creatorDetails.cover, keyName)) {
    //     if (user.creator) user.creator.cover = keyName;
    //   }
    // }

    if (user.creator && userData.creatorDetails.company.name) {
      user.creator["company"] = {
        name: userData.creatorDetails.company.name,
        country: userData.creatorDetails.company.country,
        website: userData.creatorDetails.company.website
      };
    }

    // if (user.creator?.websites) {
    //   if (userData.creatorDetails.website1)
    //     user.creator.websites.push(userData.creatorDetails.website1);
    //   if (userData.creatorDetails.website2)
    //     user.creator.websites.push(userData.creatorDetails.website2);
    //   if (userData.creatorDetails.website3)
    //     user.creator.websites.push(userData.creatorDetails.website3);
    //   if (userData.creatorDetails.website4)
    //     user.creator.websites.push(userData.creatorDetails.website4);
    //   if (userData.creatorDetails.website5)
    //     user.creator.websites.push(userData.creatorDetails.website5);
    // }

    if (userData.selectedAccounts.user) {
      user.customer = {
        isCustomer: true,
        customerId: uuidv4()
      };
    }

    if (userData.selectedAccounts.affiliate) {
      user.affiliate = {
        isAffiliate: true,
        affiliateId: uuidv4()
      };
    }

    const response = await register(user);
    setConfirmOpen(true);
    if (response.success) {
      setConfirmTitle("Success");
      setConfirmMessage("A new creator was newly registered!");
    } else {
      setConfirmTitle("Error");
      setConfirmMessage(response.error as string);
    }
  };

  const onContinue = () => {
    setDisabled(true);
    processUserData().then(() => {
      setDisabled(false);
    });
  };

  const onConfirmed = () => {
    setConfirmOpen(false);
    if (confirmTitle === "Success") {
      handleNext();
    }
  };

  const onBack = () => {
    handleBack();
  };

  return (
    <div className="w-full flex flex-col gap-y-6">
      <ConfirmAlert
        open={isConfirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onOK={onConfirmed}
      />
      <p className="text-xl text-white">Complete registration for a creator.</p>
      <div className="flex flex-col">
        <p>Congratulations!</p>
        <p className="text-base text-gray-500">
          You are ready to participate as a creator!
        </p>
      </div>
      <p>
        ** Creators will be given all of the necessary screens to allow them to
        effective Define new Products, Create, Read, Update and Delete.
      </p>
      <p>
        ** You will ideally spend a great amount of time uploading products and
        prepping them for launch time.
      </p>
      <p>
        ** Each product uploaded by a Creator needs to be submitted to an
        Approval Queue on the Management side, whereby the Creative Staff or
        Admins can go into the products, make edits, add files like Licensing
        Data.
      </p>
      <div className="w-full flex items-center justify-between mt-4">
        <Button
          disabled={isDisabled}
          variant={"outline"}
          className="w-64 flex gap-x-4 border-red-700"
          onClick={onBack}
        >
          <FaArrowLeft />
          Back
        </Button>
        <Button
          disabled={isDisabled}
          className="w-64 flex gap-x-4"
          onClick={onContinue}
        >
          <FaUser />
          Complete
        </Button>
      </div>
    </div>
  );
};
