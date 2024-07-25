"use client";

import { useState } from "react";
import Popper from "../shared/Popper";
import { ArrowIconDown1, ArrowIconUp1 } from "../icons/ArrowIcons";
import Divider from "../shared/Divider";
import Button from "../shared/forms/Button";
import { LockIcon1 } from "../icons/lock-icons";

const OrderDetails = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className="border border-grey-100 rounded-2xl w-full bg-white">
      <h1 className="px-6 pt-6 pb-4 border-b border-b-grey-100 md:text-lg font-medium md:font-semibold">Order Details</h1>
      <div className="px-6 py-4 pb-6 space-y-4">
        <div className="space-y-3">
          <h2 className="text-grey-800 font-semibold">Monthly Plan</h2>
          <div className="flex items-center justify-between gap-2">
            <Popper
              placement="bottom-end"
              renderButton={(setReferenceElement, referenceElement) => (
                <div
                  className="cursor-pointer flex items-center gap-1.5"
                  onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
                >
                  <p className="text-grey-800">Monthly Subscription</p>
                  {!referenceElement ? (
                    <ArrowIconDown1 className="!w-2.5 !h-3" color="grey-800" />
                  ) : (
                    <ArrowIconUp1 className="!w-2.5 !h-3" color="grey-800" />
                  )}
                </div>
              )}
              renderContent={(setReferenceElement) => (
                <div className="z-10 rounded-xl bg-white shadow-1">
                  <div className="py-2 px-4 text-xs font-medium rounded-t-xl cursor-pointer transition-all duration-100 hover:bg-primary-main-50">
                    Monthly
                  </div>
                  <div className="py-2 px-4 text-xs font-medium rounded-b-xl cursor-pointer transition-all duration-100 hover:bg-primary-main-50">
                    Annually
                  </div>
                </div>
              )}
            />
            <p className="font-medium">$20.00</p>
          </div>
        </div>
        <Divider />
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-1">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">20 USD</p>
          </div>
          <p className="text-xs font-medium">
            By confirming your purchase, you agree to the The Parcel Market{" "}
            <span className="text-xs font-medium text-primary-main underline">terms and conditions</span>
          </p>
        </div>
        <div className="space-y-4">
          <Button className="w-full">Confirm Purchase</Button>
          <div className="flex items-center gap-1.5 justify-center">
            <LockIcon1 />
            <p className="text-grey-800 text-xs font-medium">Purchase protected by (here goes name)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
