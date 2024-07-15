"use client";

import { SortEnum } from "@/types/common";
import { useAtom } from "jotai";
import { useState } from "react";
import { sentOffersAtom } from "@/atoms/sent-offers-atom";
import { deleteSentOffersAction, revalidateSentOffers } from "@/server-actions/offer/actions";
import toast from "react-hot-toast";
import Sort from "../../../shared/filters/Sort";
import SelectButton from "../../../shared/forms/Button/SelectButton";
import ResponsiveRemoveModal from "../../../shared/modals/ResponsiveRemoveModal";
import { receivedOffersAtom } from "@/atoms/received-offers-atom";
import ReceivedOffersMobileFilters from "./received-offer-mobile-filters";

const ReceivedOffersHeader = ({ totalCount }: { totalCount: number }) => {
  const [receivedOffersOptions, setReceivedOffersOption] = useAtom(receivedOffersAtom);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [pending, setPending] = useState(false);

  const onRemove = async () => {
    if (receivedOffersOptions.selectedOffersIds) {
      setPending(true);
      const { errorMessage } = await deleteSentOffersAction(receivedOffersOptions.selectedOffersIds);
      if (errorMessage) {
        toast.error(errorMessage);
        setPending(false);
      } else {
        setOpenRemoveModal(false);
        setReceivedOffersOption({ selecting: false, selectedOffersIds: null });
        await revalidateSentOffers();
      }
    }
  };

  return (
    <>
      <ResponsiveRemoveModal
        open={openRemoveModal}
        pending={pending}
        handleClose={() => {
          setOpenRemoveModal(false);
        }}
        onReject={() => {
          setReceivedOffersOption((prev) => ({ ...prev, selecting: false, selectedOffersIds: null }));
          setOpenRemoveModal(false);
        }}
        title="Delete Selected Received Offers??"
        desc="Are you sure you want to delete the selected received offers? If so, any outstanding offers will be rescinded and deleted."
        onOk={onRemove}
      />
      <div className="flex items-center gap-3 sm:justify-between sm:w-full">
        <div className="block sm:hidden mr-auto">
          <ReceivedOffersMobileFilters />
        </div>
        <SelectButton
          selecting={receivedOffersOptions.selecting}
          onClick={() => setReceivedOffersOption((prev) => ({ ...prev, selecting: !prev.selecting, selectedOffersIds: null }))}
          total={receivedOffersOptions.selectedOffersIds?.length}
          className="ml-auto sm:ml-0"
          onRemove={() => setOpenRemoveModal(true)}
        />
        <div className="flex items-center gap-3">
          <p className="hidden sm:block text-grey-600 text-xs">{totalCount} received offers</p>
          <Sort options={SortEnum} />
        </div>
      </div>
    </>
  );
};

export default ReceivedOffersHeader;
