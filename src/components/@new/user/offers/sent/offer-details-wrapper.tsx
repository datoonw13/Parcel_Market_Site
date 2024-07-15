"use client";

import Button from "@/components/@new/shared/forms/Button";
import routes from "@/helpers/routes";
import Link from "next/link";
import { useState } from "react";
import { OfferModel } from "@/types/offer";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import clsx from "clsx";
import OfferDetail from "../details/offer-detail";

const OfferDetailsWrapper = ({
  data,
  contentClassName,
  actionClassName,
}: {
  data: OfferModel;
  contentClassName?: string;
  actionClassName?: string;
}) => {
  const [openCancelModal, setOpenCancelModal] = useState(false);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className={clsx("overflow-hidden flex", contentClassName)}>
          <OfferDetail data={data} />
        </div>
        <div className={clsx("flex gap-3 border-t border-t-grey-100", actionClassName)}>
          <Button variant="secondary">Contact Buyer</Button>
          <Button color="error" className="ml-auto" onClick={() => setOpenCancelModal(true)}>
            Cancel Offer
          </Button>
          <Link href={`${routes.marketplace.fullUrl}/${data?.sellingPropertyId}`}>
            <Button>View Land</Button>
          </Link>
        </div>
      </div>
      <ResponsiveRemoveModal
        open={openCancelModal}
        pending={false}
        handleClose={() => {
          setOpenCancelModal(false);
        }}
        onReject={() => {
          setOpenCancelModal(false);
        }}
        title="Cancel Offer?"
        desc="Are you sure you want to cancel your offer?"
        onOk={() => setOpenCancelModal(false)}
      />
    </>
  );
};

export default OfferDetailsWrapper;
