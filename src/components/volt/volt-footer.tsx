import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";

const VoltFooter = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-between", className)}>
    <div className="flex gap-3 items-center justify-center lg:justify-start">
      <Link href={routes.privacyPolicy.fullUrl}>
        <p className="text-sm text-gray-800">Privacy Policy</p>
      </Link>
      <div className="w-[1px] h-4 bg-gray-200" />
      <Link href={routes.termsConditions.fullUrl}>
        <p className="text-sm text-gray-800">Terms of use</p>
      </Link>
    </div>
    <p className="text-xs font-medium text-grey-600 text-center lg:text-start">
      ©{new Date().getFullYear()} Parcel Market. All rights reserved.
    </p>
  </div>
);

export default VoltFooter;
