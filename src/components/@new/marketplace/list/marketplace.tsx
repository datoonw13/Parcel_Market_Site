"use client";

import { IDecodedAccessToken } from "@/types/auth";
import { SellingPropertyDetails } from "@/types/property";
import { IPagination } from "@/types/common";
import { FC, ReactNode } from "react";
import { IMarketplaceFilters } from "@/types/lands";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import Link from "next/link";
import Container from "../../shared/Container";
import SubscriptionAlert from "../../shared/subscription-alert";
import MarketPlaceFilters from "./filters/marketplace-filters";
import { ArrowIconLeftFilled1 } from "../../icons/ArrowIcons";

interface MarketplaceProps {
  user: IDecodedAccessToken | null;
  initialData: ({ list: SellingPropertyDetails[] } & IPagination) | null;
  children: ReactNode;
  totalCount: number;
}

const Marketplace: FC<MarketplaceProps> = ({ user, initialData, children, totalCount }) => {
  const searchPrams = useSearchParams();
  const params = new URLSearchParams(searchPrams.toString());
  const pathname = usePathname();
  const router = useRouter();

  const selectedFilters: IMarketplaceFilters = {
    search: params.get("search"),
    states: params.get("states")?.split(",") || null,
    counties: params.get("counties")?.split(",") || null,
    acreageMin: Number(params.get("acreageMin")) || null,
    acreageMax: Number(params.get("acreageMax")) || null,
    page: Number(params.get("page")) || 1,
    sortBy: (params.get("sortBy") as any) || null,
    voltValueMin: Number(params.get("voltValueMin")) || null,
    voltValueMax: Number(params.get("voltValueMax")) || null,
  };

  const onChange = <T extends keyof IMarketplaceFilters>(data: { [key in T]: IMarketplaceFilters[T] }) => {
    Object.keys(data).forEach((key) => {
      const value = data[key as T];
      if (value) {
        const filterValue = Array.isArray(value) ? value.join(",") : value.toString();
        params.set(key, filterValue);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <Container className="py-6 md:py-8">
      <SubscriptionAlert user={user} />
      <div className="space-y-10 md:space-y-8">
        <div className="">
          <div className="flex items-center gap-1.5 cursor-pointer mb-8 md:mb-10">
            <Link href={routes.home.fullUrl}>
              <p className="text-sm text-grey-800">Homepage</p>
            </Link>
            <div className="w-5 h-5 flex items-center justify-center">
              <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
            </div>
            <p className="text-sm text-primary-main font-medium">Lands Marketplace</p>
          </div>
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center">Parcel Marketplace</h1>
            <h6 className="font-medium md:text-sm md:text-grey-800 text-center max-w-3xl m-auto">
              Welcome to Parcel Marketplace where investors and sellers can connect for unique, off-market land opportunities.
            </h6>
          </div>
        </div>
        <MarketPlaceFilters selectedFilters={selectedFilters} onChange={onChange} totalCount={totalCount} user={user} />
      </div>
      {children}
    </Container>
  );
};

export default Marketplace;
