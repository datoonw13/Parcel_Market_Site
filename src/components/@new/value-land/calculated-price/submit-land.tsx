"use client";

import Image from "next/image";
import { useSetAtom } from "jotai";
import { valueLandAtom } from "@/atoms/value-land-atom";
import routes from "@/helpers/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertySellReq } from "@/types/property";
import { useState } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import Button from "../../shared/forms/Button";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import { InfoIcon2 } from "../../icons/InfoIcons";

const SubmitLand = ({ user }: { user: IDecodedAccessToken | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const setValueLandData = useSetAtom(valueLandAtom);
  const [openWarningModal, setOpenWarningModal] = useState(false);

  const handleNext = (sellerType: PropertySellReq["sellerType"]) => {
    if (!user || !user.isSubscribed) {
      setOpenWarningModal(true);
    } else {
      setValueLandData((prev) => ({ ...prev, sellerType }));
      router.push(routes.valueLand.about.fullUrl);
    }
  };

  return (
    <>
      <ResponsiveWarningModal
        customIcon={<InfoIcon2 className="!w-4 !h-4" color="primary-main" />}
        open={openWarningModal}
        variant="success"
        closeModal={() => setOpenWarningModal(false)}
        onOK={() => {
          params.set("from", routes.valueLand.value.fullUrl);
          router.replace(`${!user?.isSubscribed ? routes.user.subscription.fullUrl : routes.auth.signIn.fullUrl}?${params.toString()}`);
        }}
        onCancel={() => setOpenWarningModal(false)}
        title={!user?.isSubscribed ? "Subscribe" : "Log In"}
        description={
          !user?.isSubscribed
            ? "Please subscribe to our website to continue submitting your property on our marketplace"
            : "Please log into your account to continue submitting your property on our marketplace"
        }
        okLabel={!user?.isSubscribed ? "Subscribe" : "Log In"}
        cancelLabel="Close"
      />
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-lg font-semibold">If you want so sell your property choose method</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full p-4 sm:p-6 md:p-8 sm:px-5 md:px-6 border border-grey-100 rounded-2xl flex flex-col justify-center items-center">
            <div className="relative w-12 h-12 mb-3">
              <Image fill src="/Group 1000004532.svg" alt="" className="rounded-full" />
            </div>
            <p className="max-w-96 text-sm text-center mb-7">
              Interested in receiving offers from investors on your land? List Your Property on Parcel Marketplace today.
            </p>
            <Button onClick={() => handleNext("sale")}>Submit your property</Button>
          </div>
          <div className="p-4 sm:p-6 md:p-8 w-full sm:px-5 md:px-6 border border-grey-100 rounded-2xl flex flex-col justify-center items-center">
            <div className="relative w-12 h-12 mb-3">
              <Image fill src="/Group 1000004531.svg" alt="" className="rounded-full" />
            </div>
            <p className="max-w-96 text-sm text-center mb-7">
              Interested in marketing or appraising your land? Connect with an experienced land professional in your area.
            </p>
            <Button>Connect with a local expert</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitLand;
