"use client";

import { FC, useState } from "react";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import Sort from "@/components/@new/shared/filters/Sort";
import { SortEnum } from "@/types/common";
import SelectButton from "@/components/@new/shared/forms/Button/SelectButton";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import { deleteReceivedOffers, revalidateReceivedOffers } from "@/server-actions/user/offers-actions";
import toast from "react-hot-toast";
import useMediaQuery from "@/hooks/useMediaQuery";
import { usePathname, useRouter } from "next/navigation";
import { OfferModel } from "@/types/offer";
import ReceivedOffersMobileFilters from "./filters/mobile-filters";
import ReceivedOfferListItem from "./list-item/list-item";
import OfferDetailModal from "../../components/detail-modal";

interface ReceivedOffersListProps {
  data: OfferModel[];
  totalCount: number;
}

const ReceivedOffersList: FC<ReceivedOffersListProps> = ({ data, totalCount }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const isSmallDevice = useMediaQuery(1024);
  const [removePending, setRemovePending] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[] | null>(null);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [openOffer, setOpenOffer] = useState<OfferModel | null>(null);

  const openOfferDetail = (offer: OfferModel) => {
    if (isSmallDevice) {
      push(`${pathname}/${offer.id}`);
    } else {
      setOpenOffer(offer);
    }
  };

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
      await deleteReceivedOffers(selectedIds!);
      toast.success("Offer successfully removed");
      await revalidateReceivedOffers();
    } catch (error) {
      toast.error("Offers remove failed");
    } finally {
      setRemovePending(false);
    }
  };

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
      <OfferDetailModal data={openOffer} handleClose={() => setOpenOffer(null)} />
      <div className="space-y-6 md:space-y-4">
        <div className="flex items-center gap-3 sm:justify-between sm:w-full">
          <div className="block sm:hidden mr-auto">
            <ReceivedOffersMobileFilters />
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
        {totalCount === 0 && <DataNotFound message="No received offers yet" />}
        <div className="flex flex-col gap-6 md:gap-4">
          {data.map((offer) => (
            <ReceivedOfferListItem
              key={offer.id}
              data={offer}
              selecting={!!selectedIds}
              toggleSelect={handleSelect}
              selected={!!selectedIds?.includes(offer.id)}
              openDetail={openOfferDetail}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ReceivedOffersList;
