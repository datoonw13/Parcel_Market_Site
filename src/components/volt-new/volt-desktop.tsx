"use client";

import { IDecodedAccessToken } from "@/types/auth";
import { FC, useEffect, useState, useTransition } from "react";
import { VoltSearchModel } from "@/types/volt";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/icons/Logo";
import { UseFormReturn } from "react-hook-form";
import { ResponseModel } from "@/types/common";
import { IMainPropertyBaseInfo } from "@/types/property";
import { breakPoints } from "../../../tailwind.config";
import VoltFooter from "./volt-footer";
import VoltSearch from "./volt-search";
import VoltSearchAlerts from "./volt-search-alerts";
import VoltSearchResult from "./volt-search-result";

interface VoltDesktopProps {
  user: IDecodedAccessToken | null;
  form: UseFormReturn<VoltSearchModel>;
  data: ResponseModel<IMainPropertyBaseInfo[] | null> | null;
}

const VoltDesktop: FC<VoltDesktopProps> = ({ user, form, data }) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.xl));
  const [isPending, startTransition] = useTransition();
  const [searchError, setSearchError] = useState<"limit" | "notFound" | null>(null);

  useEffect(() => {
    if (data?.errorMessage) {
      setSearchError(data.errorMessage === "Search limit exceeded for this month." ? "limit" : "notFound");
    }
  }, [data]);

  return (
    <>
      <table className="w-full h-full">
        <thead>
          <tr>
            <th className="max-w-[410px] w-[410px] xl:max-w-[490px] xl:w-[490px] m-0 p-0 border-0 h-0" />
            <th className="m-0 p-0 border-0 h-0" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={isSmallDevice ? 1 : 2} className="relative h-full">
              <div className="h-full flex flex-col overflow-auto absolute top-0">
                <div className="px-14 xl:px-16 pt-14 xl:pt-16 pb-14">
                  <Link href="/">
                    <Logo className="w-[141px] h-10" />
                  </Link>
                </div>
                <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll">
                  <div className={cn("h-full flex flex-col px-8 xl:px-11 gap-12 relative pb-6")}>
                    <div className="overflow-auto flex flex-col gap-8">
                      <div className="space-y-6">
                        <VoltSearch
                          isSearchLimitError={searchError === "limit"}
                          isPending={isPending}
                          form={form}
                          startTransition={startTransition}
                        />
                        <VoltSearchAlerts error={searchError} setError={setSearchError} />
                      </div>
                      {data?.data && <VoltSearchResult data={data.data} />}

                      {isPending && (
                        <div id="loader" className="space-y-4">
                          <div className="space-y-1">
                            <div className="max-w-40 w-full h-6 rounded-2xl bg-grey-100 animate-pulse" />
                            <div className="max-w-64 w-full h-5 rounded-2xl bg-grey-100 animate-pulse" />
                          </div>
                          <div className="w-full h-64 rounded-2xl bg-grey-100 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <VoltFooter className="flex-col items-start mt-auto" />
                  </div>
                </ScrollArea>
                {false && (
                  <div className="bg-white px-8 xl:px-11 pt-6 pb-8 xl:pb-11 border-t border-t-grey-100">
                    <Button
                      id="volt-get-value-button"
                      onClick={() => {
                        // if (user) {
                        //   calculatePrice();
                        // } else {
                        //   setShowCalculationTerms(true);
                        // }
                      }}
                      // disabled={!values.selectedItem}
                      className="w-full"
                    >
                      Get Data
                    </Button>
                  </div>
                )}
              </div>
            </td>
            <td rowSpan={1} className="bg-primary-main-100 h-full">
              Map
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
export default VoltDesktop;
