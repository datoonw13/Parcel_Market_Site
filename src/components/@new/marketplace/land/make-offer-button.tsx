"use client";

import { usePathname, useRouter } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState } from "react";
import Button from "../../shared/forms/Button";
import CreateOfferModal from "../offer/create-offer-modal";

const MakeOfferButton = ({ sellingPropertyId }: { sellingPropertyId: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isSmallDevice = useMediaQuery(1024);
  const [openModal, setOpenModal] = useState(false);

  const createOffer = () => {
    if (!isSmallDevice) {
      setOpenModal(true);
    } else {
      router.push(`${pathname}/offer`);
    }
  };
  return (
    <>
      <CreateOfferModal open={openModal} closeModal={() => setOpenModal(false)} sellingPropertyId={sellingPropertyId.toString()} />
      <Button onClick={createOffer}>Make An Offer</Button>
    </>
  );
};

export default MakeOfferButton;
