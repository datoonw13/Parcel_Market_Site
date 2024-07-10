"use client";

import { FC, useEffect, useLayoutEffect, useState } from "react";
import { ReceivedOfferModel } from "@/types/offer";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import Sort from "@/components/@new/shared/filters/Sort";
import { SortEnum } from "@/types/common";
import SelectButton from "@/components/@new/shared/forms/Button/SelectButton";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import { deleteReceivedOffers } from "@/server-actions/user/received-offers-actions";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReceivedOfferBox from "./received-offer-box/received-offer-box";
import UserReceivedOffersMobileFilters from "./received-offer-mobile-filters";
import ReceivedOfferModal from "./received-offer-detail/received-offer-desktop-detail";

interface ReceivedOffersListProps {
  data: ReceivedOfferModel[];
}

const ReceivedOffersList: FC<ReceivedOffersListProps> = ({ data }) => {
  const { replace } = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [removePending, setRemovePending] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[] | null>(null);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const handleSelect = (offerId: number) => {
    if (!selectedIds) {
      return;
    }
    if (selectedIds?.includes(offerId)) {
      setSelectedIds(selectedIds.filter((id) => id !== offerId));
    } else {
      setSelectedIds([...(selectedIds || []), offerId]);
    }
  };

  const removeOffers = async () => {
    try {
      setRemovePending(true);
      const { error } = await deleteReceivedOffers(selectedIds!);
      if (error) {
        throw new Error();
      }
      setOpenRemoveModal(false);
      setSelectedIds(null);
    } catch (error) {
      toast.error("Offers remove failed");
    } finally {
      setRemovePending(false);
    }
  };

  useLayoutEffect(() => {
    console.log("aqa");

    params.delete("showDetail");
    replace(`${pathname}?${params.toString()}`);
  }, []);

  return (
    <>
      <ResponsiveRemoveModal
        desc="Are you sure you want to delete offers you selected?"
        title="Delete selected received offers?"
        open={openRemoveModal}
        handleClose={() => setOpenRemoveModal(false)}
        onCancel={() => {
          setOpenRemoveModal(false);
          setSelectedIds(null);
        }}
        onDelete={removeOffers}
        pending={removePending}
      />
      <ReceivedOfferModal />
      <div className="space-y-6 md:space-y-4">
        <div className="flex items-center gap-3 sm:justify-between sm:w-full">
          <div className="block sm:hidden mr-auto">
            <UserReceivedOffersMobileFilters />
          </div>
          <SelectButton
            selecting={!!selectedIds}
            onClick={() => setSelectedIds(selectedIds ? null : [])}
            total={selectedIds?.length}
            className="ml-auto sm:ml-0"
            onRemove={() => setOpenRemoveModal(true)}
          />
          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-grey-600 text-xs">1326,000 Lands</p>
            <Sort options={SortEnum} />
          </div>
        </div>
        {data.length === 0 && <DataNotFound message="No received offers yet" />}
        <div className="flex flex-col gap-6 md:gap-4">
          {data.map((offer) => (
            <ReceivedOfferBox
              key={offer.id}
              data={offer}
              selecting={!!selectedIds}
              onClick={handleSelect}
              selected={!!selectedIds?.includes(offer.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ReceivedOffersList;
