import Divider from "../@new/shared/Divider";

const MiniFooter = () => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
    <div className="flex flex-row gap-3 items-center">
      <p className="text-sm text-grey cursor-pointer">Privacy Policy</p>
      <Divider className="!w-[1px] !h-4" />
      <p className="text-sm text-grey cursor-pointer">Terms of use</p>
    </div>
    <p className="text-xs font-medium text-grey-600">©{new Date().getFullYear()} Parcel Market. All rights reserved.</p>
  </div>
);

export default MiniFooter;
