"use client";

import { useState } from "react";
import { getUserBillingHistoryAction } from "@/server-actions/subscription/actions";
import { IStripeCharge } from "@/types/subscriptions";
import useNotification from "@/hooks/useNotification";
import PaymentDetailsItem from "../payment-details-item";
import PaymentDetailsModal from "./payment-details-modal";

const BillingHistory = () => {
  const { notify } = useNotification();
  const [pending, setPending] = useState(false);
  const [data, setData] = useState<IStripeCharge[] | null>(null);

  const getBillingHistory = async () => {
    setPending(true);
    const { data } = await getUserBillingHistoryAction();
    setPending(false);
    if (data) {
      setData(data.filter((el) => el.paid));
    } else {
      notify({ title: "Billing history error", description: "You do not have a billing history yet" }, { variant: "error" });
    }
  };

  return (
    <>
      <PaymentDetailsModal open={!!data} closeModal={() => setData(null)} data={data} />
      <PaymentDetailsItem
        title="Billing History"
        description="See all the past payments"
        buttonLabel="Billing History"
        onClick={getBillingHistory}
        pending={pending}
      />
    </>
  );
};

export default BillingHistory;
