"use client";

import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { moneyFormatter } from "@/helpers/common";
import { AccordionContent } from "@radix-ui/react-accordion";
import React, { useEffect, useState } from "react";
import { IUserRecentSearches } from "@/types/user";
import { useAtom } from "jotai";
import { userRecentSearchesAtom } from "@/atoms/pages-atom";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, updateSearchParamsWithFilters } from "@/lib/utils";
import { IDecodedAccessToken } from "@/types/auth";
import ResponsiveAlertDialog from "@/components/ui/dialogs/responsive-alert-dialog";
import routes from "@/helpers/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { removeUserSearches } from "@/server-actions/user-searches/actions";
import { SortEnum } from "@/types/common";
import { z } from "zod";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import useNotification from "@/hooks/useNotification";
import RecentSearchesPagination from "./pagination";
import RecentSearchesLitItemMobileMini from "./list-item/mobile-mini";
import RecentSearchesLitItemDesktop from "./list-item/desktop";
import RecentSearchesLitItemMobileFull from "./list-item/mobile-full";
import UserSelectListItems from "../shared/select-list-items";

const UserRecentSearchesList = ({
  pageSize,
  totalCount,
  data,
  user,
  isUserSubscriptionTrial,
}: {
  pageSize: number;
  totalCount: number;
  data: IUserRecentSearches[];
  user: IDecodedAccessToken | null;
  isUserSubscriptionTrial?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { notify } = useNotification();
  const [subscriptionWarning, setSubscriptionWarning] = useState(false);
  const [openItem, setOpenItem] = useState<string>("");
  const [userRecentSearchesOption, setUserRecentSearchesOptions] = useAtom(userRecentSearchesAtom);
  const [mobileFullViewItem, setMobileFullViewItem] = useState<IUserRecentSearches | null>(null);

  useEffect(() => {
    if (userRecentSearchesOption.selecting) {
      setOpenItem("");
    }
  }, [userRecentSearchesOption.selecting]);

  useEffect(
    () => () => {
      setUserRecentSearchesOptions({ selecting: false, selectedIds: [], isAllSelected: false });
    },
    [setUserRecentSearchesOptions]
  );

  useEffect(() => {
    setUserRecentSearchesOptions((prev) => ({
      ...prev,
      isAllSelected: userRecentSearchesOption.selectedIds.length === data.length,
    }));
  }, [data.length, setUserRecentSearchesOptions, userRecentSearchesOption.selectedIds]);

  return (
    <>
      <ResponsiveAlertDialog
        mediaQuery={null}
        open={subscriptionWarning}
        closeModal={() => setSubscriptionWarning(false)}
        okButton={{
          show: true,
          label: "Continue",
          onClick: () => {
            setSubscriptionWarning(false);
            router.push(routes.user.subscription.fullUrl);
          },
        }}
        cancelButton={{ show: true, label: "Close", onClick: () => setSubscriptionWarning(false) }}
        title="Please sign in or subscribe to see the sales data"
        description="You will need to sign in or subscribe to view, analyze, or export sales data"
      />
      {mobileFullViewItem && (
        <RecentSearchesLitItemMobileFull
          openSubscriptionWarning={() => setSubscriptionWarning(true)}
          user={user}
          isUserSubscriptionTrial={isUserSubscriptionTrial}
          data={mobileFullViewItem}
        />
      )}
      {data.length > 0 && (
        <UserSelectListItems
          isAllSelected={userRecentSearchesOption.isAllSelected}
          selecting={userRecentSearchesOption.selecting}
          totalSelectedIds={userRecentSearchesOption.selectedIds.length}
          totalItems={totalCount}
          onSelectClick={() => {
            setUserRecentSearchesOptions((prev) => ({
              ...prev,
              selecting: !prev.selecting,
              selectedIds: prev.selecting ? [] : prev.selectedIds,
            }));
          }}
          dialogTitle="Delete Selected Searches?"
          dialogDescription="Are you sure you want to delete selected Searches?"
          onRemove={() => removeUserSearches(userRecentSearchesOption.selectedIds)}
          onRemoveSuccess={() => {
            setUserRecentSearchesOptions({ isAllSelected: false, selectedIds: [], selecting: false });
            notify({ title: "Success!", description: "Your selected searches have been successfully deleted" });
          }}
          sortEnum={SortEnum}
          sortChange={(value) => {
            const newSearchParams = updateSearchParamsWithFilters<z.infer<typeof userRecentSearchesValidations>>(
              [{ key: "sortBy", value }],
              searchParams.toString()
            );
            router.push(`${pathname}?${newSearchParams.toString()}`);
          }}
          totalLabel="Lands"
          label="Sort By"
          selectedFilter={searchParams.get("sortBy")}
        />
      )}
      <div className="space-y-8 md:space-y-11">
        <div>
          <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={(value) => {
              if (!userRecentSearchesOption.selecting) {
                setOpenItem(value);
                router.push(`#${value.toString()}`);
              }
            }}
            className="w-full lg:border lg:rounded-2xl space-y-3 lg:space-y-0 lg:[&>div:last-child]:border-b-0 [&>div:first-child]:rounded-t-2xl [&>div:first-child>h3>button]:rounded-t-2xl"
          >
            {userRecentSearchesOption.selecting && (
              <AccordionItem value="select-all" className="border rounded-2xl lg:border-0 lg:border-b lg:rounded-none ">
                <AccordionTrigger
                  onClick={() => {
                    if (userRecentSearchesOption.isAllSelected) {
                      setUserRecentSearchesOptions((prev) => ({
                        ...prev,
                        selectedIds: [],
                      }));
                    } else {
                      setUserRecentSearchesOptions((prev) => ({
                        ...prev,
                        selectedIds: data.map((el) => Number(el.id)),
                      }));
                    }
                  }}
                  className="px-5 lg:px-6 py-5 lg:py-3 text-start text-wrap grid grid-cols-[1fr_minmax(0,_max-content)] gap-3 [&>svg]:hidden "
                >
                  <span className="truncate flex items-center gap-4">
                    {userRecentSearchesOption.selecting && (
                      <Checkbox checked={userRecentSearchesOption.isAllSelected} onChange={(e) => e.stopPropagation()} />
                    )}
                    Select All
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 lg:px-6 " />
              </AccordionItem>
            )}
            {data.map((search) => (
              <AccordionItem
                key={search.id}
                value={search.id.toString()}
                id={search.id.toString()}
                className={cn(`
                border rounded-2xl 
                lg:border-0 lg:border-b lg:!border-b-grey-100 lg:rounded-none 
                data-[state=open]:border-[#9FD1B3] data-[state=open]:bg-primary-main-50
                hover:border-[#9FD1B3] hover:bg-primary-main-50
                lg:data-[state=open]:bg-transparent
                hover:!no-underline
                `)}
              >
                <AccordionTrigger
                  onClick={() => {
                    if (!userRecentSearchesOption.selecting) {
                      return;
                    }
                    if (userRecentSearchesOption.selectedIds?.includes(Number(search.id))) {
                      setUserRecentSearchesOptions((prev) => ({
                        ...prev,
                        selectedIds: prev.selectedIds?.filter((el) => el !== Number(search.id)) || null,
                      }));
                    } else {
                      setUserRecentSearchesOptions((prev) => ({
                        ...prev,
                        selectedIds: [...(prev.selectedIds || []), Number(search.id)],
                      }));
                    }
                  }}
                  className="px-5 lg:px-6 py-5 lg:py-3 text-start grid grid-cols-[1fr_minmax(0,_max-content)] gap-3 lg:data-[state=open]:bg-primary-main-100"
                >
                  <div className="grid grid-cols-[minmax(0,_max-content)_1fr] items-center gap-3">
                    {userRecentSearchesOption.selecting && (
                      <Checkbox
                        checked={!!userRecentSearchesOption.selectedIds?.includes(Number(search.id))}
                        onChange={(e) => e.stopPropagation()}
                      />
                    )}
                    <span className="truncate inline-block">
                      {search.state.label}/{search.county.label}/{search.acreage.toFixed(2)}/{moneyFormatter.format(search.price)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 lg:px-6 py-6 md:py-3">
                  <RecentSearchesLitItemMobileMini
                    data={{
                      owner: search.owner,
                      acreage: search.acreage,
                      county: search.county.label,
                      parcelNumberNoFormatting: search.parcelNumberNoFormatting,
                      pricePerAcre: search.pricePerAcreage,
                      propertyType: search.propertyType,
                      searchDate: search.createdAt,
                      state: search.state.label,
                      voltPrice: search.price,
                      polygon: search.polygon,
                      lat: search.lat,
                      lon: search.lon,
                      price: search.price,
                      pricePerAcreage: search.pricePerAcreage,
                    }}
                    propertiesUsedForCalculation={search.propertiesUsedForCalculation}
                    onView={() => setMobileFullViewItem(search)}
                    isOpen={openItem === search.id.toString()}
                    canExport={!!(user?.isSubscribed && !isUserSubscriptionTrial)}
                  />
                  <RecentSearchesLitItemDesktop
                    isUserSubscriptionTrial={isUserSubscriptionTrial}
                    user={user}
                    data={search}
                    openSubscriptionWarning={() => setSubscriptionWarning(true)}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <RecentSearchesPagination pageSize={pageSize} totalCount={totalCount} />
      </div>
    </>
  );
};

export default UserRecentSearchesList;
