"use client";

import { DeletionAccountReason } from "@/types/auth";
import { useState } from "react";
import { CheckIcon3, CheckIcon4 } from "../icons/CheckIcons";
import Button from "../shared/forms/Button";
import CheckBox from "../shared/forms/CheckBox";
import RadioButton from "../shared/forms/RadioButton";
import ResponsiveWarningModal from "../shared/modals/ResponsiveWarningModal";
import PlanBox from "./plan-box";
import UpdatePlanDialog from "./update-plan-dialog";
import CancelPlanDialog from "./cancel-plan-dialog";

enum SubscriptionsEnum {
  FREE,
  MONTHLY,
  ANNUAL,
}

const currentPlan = SubscriptionsEnum.MONTHLY;

const isSelected = (plan: SubscriptionsEnum) => currentPlan === plan;

const Subscriptions = () => {
  const [openChangePlanModal, setOpenChangePlanModal] = useState(false);
  return (
    <>
      <UpdatePlanDialog closeDialog={() => {}} open={false} onSubmit={() => {}} pending={false} />
      <CancelPlanDialog
        closeDialog={() => {}}
        open={false}
        onSubmit={() => {}}
        pending={false}
        selectReason={() => {}}
        selectedReason={null}
      />
      <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center">One Subscription. Full Access</h1>
          <div className="border border-primary-main-400 rounded-2xl bg-primary-main-50 p-4 md:p-6 lg:8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-medium text-lg">Sale and Value Data</h3>
              <ul className="space-y-3">
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  VOLT Tool
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Save Property Searches
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  View Sales in Map
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Export Sale Data to KML and XML
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-lg"> Parcel Marketplace</h3>
              <ul className="space-y-3">
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Search and Post Wholesale Land Deals
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Make and Receive Offers
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Chat Directly with Investors and Landowners
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Save and Follow Listings
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-lg">Sale and Value Data</h3>
              <ul className="space-y-3">
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Contact Experienced Land Professionals
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Local to Your area
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Parcel Market Vetted and Approved
                </li>
                <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
                  <CheckIcon4 className="!h-3.5" color="primary-main" />
                  Brokers, Appraisers, and more...
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="hidden sm:block text-center text-lg font-semibold">How Would You like to Pay?</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <PlanBox title="14 Days" price="Free" period="14 Days" periodDesc="(No card needed)" onChange={() => {}} />
            <PlanBox title="Monthly" price="$20.00" period="Per Month" selected activeUntil={new Date()} onChange={() => {}} />
            <PlanBox title="Annual" price="215.00" period="Per Year" periodDesc="(Save 10% per month)" onChange={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
