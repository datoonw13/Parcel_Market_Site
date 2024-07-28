import React from "react";
import Link from "next/link";
import routes from "@/helpers/routes";
import { redirect } from "next/navigation";
import { getLendDetailsAction } from "@/server-actions/marketplace/action";
import { ArrowIconLeftFilled1 } from "../../icons/ArrowIcons";

const LandDetailsBreadcrumb = async ({ sellingPropertyId }: { sellingPropertyId: string }) => {
  const { data } = await getLendDetailsAction(sellingPropertyId);
  if (!data) {
    redirect(routes.marketplace.fullUrl);
  }
  return (
    <div className="flex items-center gap-1.5 cursor-pointer mb-8 md:mb-10">
      <Link href={routes.home.fullUrl}>
        <p className="text-sm text-grey-800">Homepage</p>
      </Link>
      <div className="w-5 h-5 flex items-center justify-center">
        <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
      </div>
      <Link href={routes.marketplace.fullUrl}>
        <p className="text-sm text-grey-800 cursor-pointer">Lands Marketplace</p>
      </Link>
      <div className="w-5 h-5 flex items-center justify-center">
        <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
      </div>
      <p className="text-sm text-primary-main font-medium">{data.title}</p>
    </div>
  );
};

export default LandDetailsBreadcrumb;
