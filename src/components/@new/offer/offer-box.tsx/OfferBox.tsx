import React from "react";
import { LocationIcon1 } from "../../icons/LocationIcons";
import { CalendarIcon1 } from "../../icons/CalendarIcons";
import Divider from "../../shared/Divider";
import Button from "../../shared/forms/Button";
import classes from "./style.module.css";

const OfferBox = () => (
  <div className={classes.root}>
    <div className="flex flex-col sm:flex-row gap-9 px-4 md:px-8 md:mb-4">
      <div className="space-y-2 grid">
        <h1 className="font-semibold text-white truncate sm:max-w-[40%] md:sm:max-w-[50%] lg:max-w-[calc(100%-160px)] sm:text-black sm:text-lg">
          long names with 3 dots long names with 3 dot long names with 3 dot...
        </h1>
        <div className="flex items-center gap-1.5">
          <LocationIcon1 color="white" className="w-3 h-3.5" />
          <h6 className="text-xs text-white">State; County; City</h6>
        </div>
      </div>
      <div className="flex justify-between sm:flex-col sm:justify-start items-center">
        <p className="text-xs font-medium sm:text-white sm:ml-auto">Offered Price</p>
        <p className="font-semibold text-primary-main sm:text-white text-2xl">$20,000</p>
      </div>
    </div>
    <div className="rounded-2xl p-4 sm:p-6 bg-grey-30 flex flex-col sm:grid sm:grid-cols-2 gap-6 my-3 mx-4 md:mx-8">
      <div className="space-y-3">
        <p className="font-semibold text-sm">Offer Information</p>
        <ul className="space-y-3 text-grey-600 text-sm font-medium">
          <li>
            Buyer: <span className="ml-1 text-black">Davit Natelashvili</span>
          </li>
          <li>
            Offered Price: <span className="ml-1 text-black">$20,000</span>
          </li>
          <li>
            Price per acre: <span className="ml-1 text-black">$2,000</span>
          </li>
        </ul>
      </div>
      <div className="space-y-3">
        <p className="font-semibold text-sm">Offer Details</p>
        <ul className="space-y-3 text-grey-600 text-sm font-medium list-outside list-disc marker:text-primary-main-400 pl-4">
          <li>
            Earnest Money: <span className="ml-1 text-black">20%</span>
          </li>
          <li>
            Inspection Period: <span className="ml-1 text-black">Split Equally</span>
          </li>
          <li>
            Closing Period:<span className="ml-1 text-black">Title; Financing</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="flex justify-between items-center px-4 md:px-8">
      <div className="flex flex-row items-center gap-1">
        <CalendarIcon1 color="grey-600" />
        <p className="text-xs text-grey-600">
          Active Until:<span className="text-black font-semibold ml-1">20 Jul</span>
        </p>
      </div>
      <div className="flex flex-row items-center gap-1">
        <div className="w-5 h-5 rounded-full bg-info" />
        <p className="text-xs text-grey-600">
          Status:<span className="text-black font-semibold ml-1">Expired</span>
        </p>
      </div>
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