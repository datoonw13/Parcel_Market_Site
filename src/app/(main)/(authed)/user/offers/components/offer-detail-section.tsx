import { CalendarIcon1 } from "@/components/@new/icons/CalendarIcons";
import OfferStatus from "@/components/@new/offer/OfferStatus";
import Alert from "@/components/@new/shared/Alert";
import { numFormatter } from "@/helpers/common";
import { OfferModel } from "@/types/offer";
import moment from "moment";
import { FC } from "react";

interface OfferDetailSectionProps {
  data: OfferModel;
}

const ReceivedOfferDetailSection: FC<OfferDetailSectionProps> = ({ data }) => (
  <div>
    <div className="rounded-2xl p-4 sm:p-6 bg-grey-30 flex flex-col sm:grid sm:grid-cols-2 gap-6 mb-3">
      <div className="space-y-3">
        <p className="font-semibold text-sm">Offer Information</p>
        <ul className="space-y-3 text-grey-600 text-sm font-medium">
          <li>
            Buyer: <span className="ml-1 text-black">{`${data.offerGivenBy.firstName} ${data.offerGivenBy.lastName}`}</span>
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
    <div className="flex justify-between items-center mb-6">
      <div className="flex flex-row items-center gap-1">
        <CalendarIcon1 color="grey-600" />
        <p className="text-xs text-grey-600">
          Active Until:<span className="text-black font-semibold ml-1">{moment(data.activeUntil, "YYYY-MM-DD").format("DD MMM")}</span>
        </p>
      </div>
      <OfferStatus status={data.offerStatus} />
    </div>
    <Alert
      title="Offer Active for"
      description={`Your offer active for ${data.offerActiveForDays} days`}
      onClose={() => {}}
      type="warning"
    />
  </div>
);

export default ReceivedOfferDetailSection;
