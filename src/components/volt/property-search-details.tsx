import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "../ui/tooltip";

const PropertySearchDetails = () => (
  <div className="space-y-6">
    <h1 className="font-semibold text-lg">Let’s locate your property using some basic information</h1>
    <div>
      <div className="flex items-center gap-2">
        <p className="text-grey-800 text-sm font-medium">Search By</p>
        <Tooltip renderButton={<FaCircleInfo className="size-3.5 text-grey-200" />} renderContent="wd" />
      </div>
    </div>
  </div>
);

export default PropertySearchDetails;
