"use client";

import React from "react";
import { ReceivedOfferModel } from "@/types/offer";
import { numFormatter } from "@/helpers/common";
import { getCountyValue, getStateValue } from "@/helpers/states";
import moment from "moment";
import { LocationIcon1 } from "../../icons/LocationIcons";
import { CalendarIcon1 } from "../../icons/CalendarIcons";
import Divider from "../../shared/Divider";
import Button from "../../shared/forms/Button";
import classes from "./style.module.css";
import Alert from "../../shared/Alert";
import OfferStatus from "../OfferStatus";

const OfferBox = ({ data }: { data: ReceivedOfferModel }) => (
  <div className={classes.root}>
    <div className="flex flex-col sm:flex-row gap-9 px-4 md:px-8">
      <div className="space-y-2 grid">
        <h1 className="font-semibold text-white truncate max-w-[80%] sm:max-w-[40%] md:sm:max-w-[50%] lg:max-w-[calc(100%-160px)] sm:text-black sm:text-lg">
          long names with 3 dots long names with 3 dot long names with 3 dot...
        </h1>
        <div className="flex items-center gap-1.5">
          <LocationIcon1 color="white" className="w-3 h-3.5 fill-white sm:fill-grey-600" />
          <h6 className="text-xs text-white sm:text-grey-600">
            {getStateValue(data.sellingProperty.state)?.label};{" "}
            {getCountyValue(data.sellingProperty.county, data.sellingProperty.state)?.label}
          </h6>
        </div>
      </div>
      <div className="flex justify-between sm:flex-col sm:justify-start items-center">
        <p className="text-xs font-medium sm:text-white sm:ml-auto">Offered Price</p>
        <p className="font-semibold text-primary-main sm:text-white sm:text-2xl">{numFormatter.format(Number(data.price))}</p>
      </div>
    </div>
    <div className="rounded-2xl p-4 sm:p-6 bg-grey-30 flex flex-col sm:grid sm:grid-cols-2 gap-6 my-3 sm:my-4 mx-4 md:mx-8">
      <div className="space-y-3">
        <p className="font-semibold text-sm">Offer Information</p>
        <ul className="space-y-3 text-grey-600 text-sm font-medium">
          <li>
            Buyer: <span className="ml-1 text-black">Davit Natelashvili</span>
          </li>
          <li>
            Offered Price: <span className="ml-1 text-black">{numFormatter.format(Number(data.price))}</span>
          </li>
          <li>
            Price per acre:{" "}
            <span className="ml-1 text-black">
              {numFormatter.format(Number(Number(data.sellingProperty.marketPrice) / data.sellingProperty.acrage))}
            </span>
          </li>
        </ul>
      </div>
      <div className="space-y-3">
        <p className="font-semibold text-sm">Offer Details</p>
        <ul className="space-y-3 text-grey-600 text-sm font-medium list-outside list-disc marker:text-primary-main-400 pl-4">
          <li>
            Earnest Money: <span className="ml-1 text-black">{data.earnestMoney}</span>
          </li>
          <li>
            Inspection Period: <span className="ml-1 text-black">{data.inspectionPeriodDays}</span>
          </li>
          <li>
            Closing Period:<span className="ml-1 text-black">{data.contigencies}</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="flex justify-between items-center px-4 md:px-8">
      <div className="flex flex-row items-center gap-1">
        <CalendarIcon1 color="grey-600" />
        <p className="text-xs text-grey-600">
          Active Until:<span className="text-black font-semibold ml-1">{moment(data.activeUntil, "YYYY-MM-DD").format("DD MMM")}</span>
        </p>
      </div>
      <OfferStatus status={data.offerStatus} />
    </div>
    <div className="px-4 md:px-8 mt-6">
      <Alert title="Offer Active for" description={`Your offer active for ${data.offerActiveForDays} days`} onClose={() => {}} type="warning" />
    </div>
    <Divider className="mt-8 mb-4" />
    <div className="flex gap-3 px-4 md:px-8">
      <Button className="w-full sm:w-fit !h-10 sm:!h-auto sm:mr-auto" variant="secondary">
        Contact Buyer
      </Button>
      <Button className="hidden sm:block w-full sm:w-fit !h-10 sm:!h-auto" variant="secondary">
        View Land
      </Button>
      <Button className="w-full sm:w-fit !h-10 sm:!h-auto">Details</Button>
    </div>
  </div>
);

export default OfferBox;
