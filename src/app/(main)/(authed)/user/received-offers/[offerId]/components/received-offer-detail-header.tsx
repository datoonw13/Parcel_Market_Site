"use client";

import routes from "@/helpers/routes";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

const ReceivedOfferDetailHeader = () => {
  const isSmallDevice = useMediaQuery(1024);
  const { replace } = useRouter();
  const prevUrl = routes.user.receivedOffers;

  useLayoutEffect(() => {
    console.log("aqaa");

    if (!isSmallDevice) {
      replace(prevUrl.fullUrl);
    }
  }, [isSmallDevice, prevUrl.fullUrl, replace]);

  return <div>ReceivedOfferDetailHeader</div>;
};

export default ReceivedOfferDetailHeader;
