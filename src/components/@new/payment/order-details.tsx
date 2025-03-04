"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SubscriptionType } from "@/types/subscriptions";
import { useState } from "react";
import { TermsConditionsDialog } from "@/components/shared/terms-conditions";
import { IUserBaseInfo } from "@/types/auth";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Popper from "../shared/Popper";
import { ArrowIconDown1, ArrowIconUp1 } from "../icons/ArrowIcons";
import Divider from "../shared/Divider";

const getPlanDetails = (plan: SubscriptionType) => {
  switch (plan) {
    case SubscriptionType.Monthly:
      return {
        label: "Monthly",
        price: "$20.00 USD",
      };
    case SubscriptionType.Annual:
      return {
        label: "Yearly",
        price: "$215.00 USD",
      };
    default:
      return {
        label: "Trial",
        price: "$0.00 USD",
      };
  }
};

const OrderDetails = ({ user }: { user: IUserBaseInfo | null }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  const [openTermsDialog, setTermsDialog] = useState(false);

  return (
    <>
      <TermsConditionsDialog open={openTermsDialog} closeModal={() => setTermsDialog(false)} />
      <div className="border border-grey-100 rounded-2xl w-full bg-white h-fit">
        <h1 className="px-6 pt-6 pb-4 border-b border-b-grey-100 md:text-lg font-medium md:font-semibold">Order Details</h1>
        <div className="px-6 py-4 pb-6 space-y-4">
          <div className="space-y-3">
            <h2 className="text-grey-800 font-semibold">{getPlanDetails(params.get("plan") as SubscriptionType).label} Plan</h2>
            <div className="flex items-center justify-between gap-2">
              <Popper
                placement="bottom-end"
                renderButton={(setReferenceElement, referenceElement) => (
                  <div
                    className="cursor-pointer flex items-center gap-1.5"
                    onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
                  >
                    <p className="text-grey-800">{getPlanDetails(params.get("plan") as SubscriptionType).label} Subscription</p>
                    {!referenceElement ? (
                      <IoChevronDown className="size-4 text-grey-800" />
                    ) : (
                      <IoChevronUp className="size-4 text-grey-800" />
                    )}
                  </div>
                )}
                renderContent={(setReferenceElement) => (
                  <div className="z-10 rounded-xl bg-white shadow-1">
                    {!user?.planSelected && (
                      <div
                        className="py-2 px-4 text-xs font-medium rounded-t-xl cursor-pointer transition-all duration-100 hover:bg-primary-main-50"
                        onClick={() => {
                          // params.set("plan", SubscriptionType.Trial);
                          router.replace(`${pathname}?${params.toString()}`);
                          setReferenceElement(null);
                        }}
                      >
                        Trial
                      </div>
                    )}
                    <div
                      className="py-2 px-4 text-xs font-medium rounded-t-xl cursor-pointer transition-all duration-100 hover:bg-primary-main-50"
                      onClick={() => {
                        params.set("plan", SubscriptionType.Monthly);
                        router.replace(`${pathname}?${params.toString()}`);
                        setReferenceElement(null);
                      }}
                    >
                      Monthly
                    </div>
                    <div
                      className="py-2 px-4 text-xs font-medium rounded-b-xl cursor-pointer transition-all duration-100 hover:bg-primary-main-50"
                      onClick={() => {
                        params.set("plan", SubscriptionType.Annual);
                        router.replace(`${pathname}?${params.toString()}`);
                        setReferenceElement(null);
                      }}
                    >
                      Yearly
                    </div>
                  </div>
                )}
              />
              <p className="font-medium min-w-max">{getPlanDetails(params.get("plan") as SubscriptionType).price}</p>
            </div>
          </div>
          <Divider />
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-1">
              <p className="font-semibold">Total</p>
              <p className="font-semibold min-w-max">{getPlanDetails(params.get("plan") as SubscriptionType).price}</p>
            </div>
            <p className="text-xs font-medium">
              By confirming your purchase, you agree to the The Parcel Market{" "}
              <span className="text-xs font-medium text-primary-main underline" onClick={() => setTermsDialog(true)}>
                terms and conditions
              </span>
            </p>
          </div>
          {/* <div className="space-y-4">
          <Button className="w-full">Confirm Purchase</Button>
          <div className="flex items-center gap-1.5 justify-center">
            <LockIcon1 />
            <p className="text-grey-800 text-xs font-medium">Purchase protected by (here goes name)</p>
          </div>
        </div> */}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
