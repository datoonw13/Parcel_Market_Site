"use client";

import { CalendarIcon1 } from "@/components/@new/icons/CalendarIcons";
import Alert from "@/components/@new/shared/Alert";
import { moneyFormatter } from "@/helpers/common";
import { OfferModel } from "@/types/offer";
import clsx from "clsx";
import moment from "moment";
import { FC } from "react";
import OfferStatus from "../offer-status";

interface OfferDetailSectionProps {
  data: OfferModel;
  rootClasses?: string;
  infoClasses?: string;
  alertClasses?: string;
}

const OfferDetailSection: FC<OfferDetailSectionProps> = ({ data, alertClasses, infoClasses, rootClasses }) => (
  <div className={clsx("flex flex-col gap-3", rootClasses)}>
    <div className="rounded-2xl p-4 sm:p-6 bg-grey-30 flex flex-col sm:grid sm:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="font-semibold text-sm">Offer Information</p>
        <ul className="space-y-3 text-grey-600 text-sm font-medium">
          <li>
            Buyer: <span className="ml-1 text-black">{`${data?.offerGivenBy?.firstName} ${data?.offerGivenBy?.lastName}`}</span>
          </li>
          <li>
            Offered Price: <span className="ml-1 text-black">{moneyFormatter.format(Number(data.price))}</span>
          </li>
          <li>
            VOLT Value Per Acre:{" "}
            <span className="ml-1 text-black">{moneyFormatter.format(Number(Number(data.price) / data.sellingProperty.acrage))}</span>
          </li>
        </ul>
      </div>
      <div className="space-y-3">
        <p className="font-semibold text-sm">Offer Details</p>
        <ul className="space-y-3 text-grey-600 text-sm font-medium list-outside list-disc marker:text-primary-main-400 pl-4">
          <li>
            Earnest Money: <span className="ml-1 text-black">{data.earnestMoney || "-"}</span>
          </li>
          <li>
            Inspection Period: <span className="ml-1 text-black">{data.inspectionPeriodDays || "-"}</span>
          </li>
          <li>
            Closing Period:<span className="ml-1 text-black">{data.closingPeriodDays || "-"}</span>
          </li>
          <li>
            Closing Costs:<span className="ml-1 text-black">{data.closingCosts || "-"}</span>
          </li>
          <li>
            Contigencies:<span className="ml-1 text-black break-words">{data.contigencies ? data.contigencies.join(";") : "-"}</span>
          </li>
          <li>
            Other Terms:<span className="ml-1 text-black">{data.otherTerms || "-"}</span>
          </li>
        </ul>
      </div>
    </div>
    <div className={clsx("flex justify-between items-center", infoClasses)}>
      <div className="flex flex-row items-center gap-1">
        <CalendarIcon1 color="grey-600" />
        <p className="text-xs text-grey-600">
          Active Until:<span className="text-black font-semibold ml-1">{moment(data.activeUntil, "YYYY-MM-DD").format("DD MMM")}</span>
        </p>
      </div>
      <OfferStatus status={data.offerStatus} />
    </div>
    <div className={clsx(alertClasses)}>
      <Alert
        title="Offer Active for"
        description={`Your offer active for ${data.offerActiveForDays} days`}
        onClose={() => {}}
        type="warning"
      />
    </div>
  </div>
);

export default OfferDetailSection;
