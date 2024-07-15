"use client";

import { SortEnum } from "@/types/common";
import { useAtom } from "jotai";
import { useState } from "react";
import { sentOffersAtom } from "@/atoms/sent-offers-atom";
import { deleteSentOffersAction, revalidateSentOffers } from "@/server-actions/offer/actions";
import toast from "react-hot-toast";
import Sort from "../../../shared/filters/Sort";
import SelectButton from "../../../shared/forms/Button/SelectButton";
import UserListingsMobileFilter from "./sent-offers-mobile-filters";
import ResponsiveRemoveModal from "../../../shared/modals/ResponsiveRemoveModal";

const SentOffersHeader = ({ totalCount }: { totalCount: number }) => {
  const [sentOffersOptions, setSentOffersOption] = useAtom(sentOffersAtom);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [pending, setPending] = useState(false);

  const onRemove = async () => {
    if (sentOffersOptions.selectedOffersIds) {
      setPending(true);
      const { errorMessage } = await deleteSentOffersAction(sentOffersOptions.selectedOffersIds);
      if (errorMessage) {
        toast.error(errorMessage);
        setPending(false);
      } else {
        setOpenRemoveModal(false);
        setSentOffersOption({ selecting: false, selectedOffersIds: null });
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
          setSentOffersOption((prev) => ({ ...prev, selecting: false, selectedOffersIds: null }));
          setOpenRemoveModal(false);
        }}
        title="Delete Selected Sent Offers??"
        desc="Are you sure you want to delete the selected sent offers? If so, any outstanding offers will be rescinded and deleted."
        onOk={onRemove}
      />
      <div className="flex items-center gap-3 sm:justify-between sm:w-full">
        <div className="block sm:hidden mr-auto">
          <UserListingsMobileFilter />
        </div>
        <SelectButton
          selecting={sentOffersOptions.selecting}
          onClick={() => setSentOffersOption((prev) => ({ ...prev, selecting: !prev.selecting, selectedOffersIds: null }))}
          total={sentOffersOptions.selectedOffersIds?.length}
          className="ml-auto sm:ml-0"
          onRemove={() => setOpenRemoveModal(true)}
        />
        <div className="flex items-center gap-3">
          <p className="hidden sm:block text-grey-600 text-xs">{totalCount} Lands</p>
          <Sort options={SortEnum} />
        </div>
      </div>
    </>
  );
};

export default SentOffersHeader;
