"use client";

import { useState } from "react";

import { CreatorDetailsForm } from "@/components/auth/register/creator-details-form";
import { RegisterCompleteForm } from "@/components/auth/register/register-complete-form";
import { SelectAccountsForm } from "@/components/auth/register/select-accounts-form";
import { SelectMatchingForm } from "@/components/auth/register/select-matching-form";
import { TransitionInOut } from "@/components/utils/transition-in-out";

import type { SignedUpData } from "@/shared/types/signup-data.type";

const OnboardingPage = () => {
  // affiliate, creator, user forms

  const [userData, setUserData] = useState<
    Omit<SignedUpData, "generalDetails">
  >({
    selectedAccounts: {
      creator: false,
      user: false,
      affiliate: false
    },
    creatorDetails: {
      bio: "",
      jobTitle: "",
      companyName: "",
      companyCountry: "",
      companyWebsite: ""
    },
    creatorMatchings: {
      env: false,
      beh: false,
      art: false,
      drb: false,
      cmk: false
    }
  });

  const [step, setStep] = useState<number>(0);

  const isCreatorStep = () => {
    return userData.selectedAccounts.creator && step === 1;
  };

  const isMatchingStep = () => {
    return userData.selectedAccounts.creator && step === 2;
  };

  // const isTaxStep = () => {
  //   let _step = 1;
  //   if (userData.selectedAccounts.creator) {
  //     _step += 4;
  //   }
  //   if (userData.selectedAccounts.affiliate) {
  //     _step += 1;
  //   }

  //   return step === _step;
  // };

  const isRegisterCompleteStep = () => {
    let _step = 1;
    if (userData.selectedAccounts.creator) {
      _step += 3;
    }
    if (userData.selectedAccounts.user) {
      _step += 1;
    }
    if (userData.selectedAccounts.affiliate) {
      _step += 1;
    }
    return step === _step;
  };

  const handleNext = () => {
    setStep((step) => step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleUpdateUserData = (data: Partial<SignedUpData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
    handleNext();
  };

  return (
    <div className="mt-16 w-[640px]">
      <TransitionInOut condition={step === 0}>
        <SelectAccountsForm onUpdate={handleUpdateUserData} />
      </TransitionInOut>
      <TransitionInOut condition={isCreatorStep()}>
        <CreatorDetailsForm
          handleUpdate={handleUpdateUserData}
          handleBack={handleBack}
        />
      </TransitionInOut>
      <TransitionInOut condition={isMatchingStep()}>
        <SelectMatchingForm
          data={userData.creatorMatchings}
          onUpdate={handleUpdateUserData}
          onNext={handleNext}
          onBack={handleBack}
        />
      </TransitionInOut>
      <TransitionInOut condition={isRegisterCompleteStep()}>
        <RegisterCompleteForm step={step} />
      </TransitionInOut>
    </div>
  );
};

export default OnboardingPage;
