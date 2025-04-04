/* eslint-disable jsx-a11y/media-has-caption */

"use client";

import { FaCircleInfo } from "react-icons/fa6";
import { LuInfo } from "react-icons/lu";
import { RadioGroup } from "@radix-ui/react-radio-group";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { getState } from "@/helpers/states";
import { Dispatch, FC, SetStateAction, TransitionStartFunction } from "react";
import { cn } from "@/lib/utils";
import { VoltSearchModel } from "@/types/volt";
import { usePathname, useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import useStates from "@/hooks/useStates";
import { Tooltip } from "../ui/tooltip";
import { RadioGroupItem } from "../ui/radio-group";
import { TextInput } from "../ui/input";
import { Button } from "../ui/button";
import { AutoComplete } from "../ui/autocomplete";
import VoltSearchAlerts from "./volt-search-alerts";

interface VoltSearchProps {
  className?: string;
  form: UseFormReturn<VoltSearchModel>;
  startTransition: TransitionStartFunction;
  isPending?: boolean;
  isSearchLimitError: boolean;
  searchError: "limit" | "notFound" | null;
  setSearchError: Dispatch<SetStateAction<"limit" | "notFound" | null>>;
  searchMapRef: any | null;
  showMobileMap?: () => void;
}

const VoltSearch: FC<VoltSearchProps> = ({
  className,
  form,
  startTransition,
  isPending,
  isSearchLimitError,
  searchError,
  setSearchError,
  searchMapRef,
  showMobileMap,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    watch,
    handleSubmit,
    setValue,
    trigger,
    formState: { isSubmitted, isDirty, errors },
    reset,
  } = form;
  const { states, getCountiesByState, getCounty } = useStates({ hideBlackListedStated: false });
  const selectedState = watch("state");
  const counties = getCountiesByState(selectedState);

  const disableSearch = isSearchLimitError;

  const onSearchTypeChange = (type: VoltSearchModel["searchType"]) => {
    router.push(`${pathname}`);
    setValue("searchType", type, { shouldValidate: true, shouldDirty: true });
    setValue("parcelNumber", undefined, { shouldValidate: true, shouldDirty: true });
    setValue("entityName", undefined, { shouldValidate: true, shouldDirty: true });
    setValue("firstName", undefined, { shouldValidate: true, shouldDirty: true });
    setValue("lastName", undefined, { shouldValidate: true, shouldDirty: true });
    if (isSubmitted) {
      trigger();
      reset({}, { keepValues: true, keepDirty: type !== "map" });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (data.searchType === "map") {
      if (searchMapRef && form.watch("state") && form.watch("county")) {
        const county = getCounty(form.watch("state"), form.watch("county"));
        if (county) {
          searchMapRef.dragPan.enable();
          searchMapRef.doubleClickZoom.enable();
          searchMapRef.scrollZoom.enable();
          searchMapRef.flyTo({ center: [county.full.lng, county.full.lat], zoom: 11 });
        }
        showMobileMap && showMobileMap();
      }
    } else {
      startTransition(async () => {
        const newParams = new URLSearchParams(
          Object.keys(data).reduce(
            (acc, cur) => ({ ...acc, ...(data[cur as keyof typeof data] && { [cur]: data[cur as keyof typeof data] }) }),
            {}
          )
        );
        router.push(`${pathname}?${newParams.toString()}`);
        reset(data);
      });
    }
  });

  return (
    <>
      {!isPending && searchError && (
        <VoltSearchAlerts
          onOk={() => {
            onSearchTypeChange("map");
            setSearchError(null);
          }}
          error={searchError}
          setError={setSearchError}
        />
      )}

      <div className={cn("flex gap-6 flex-col-reverse lg:flex-col", className)}>
        <div className="flex flex-col gap-6">
          <h1 className="font-semibold text-lg">Let’s locate your property using some basic information</h1>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 w-ma">
              <p className="text-grey-800 text-sm font-medium">Search By</p>
              <Tooltip
                renderButton={<FaCircleInfo className="size-3.5 text-grey-200" />}
                renderContent="You can locate a property using one of the following methods:"
              />
            </div>
            <RadioGroup
              onValueChange={(value) => onSearchTypeChange(value as VoltSearchModel["searchType"])}
              value={watch("searchType")}
              className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] sm:grid-cols-[minmax(0,_max-content)_,minmax(0,_max-content)_,minmax(0,_max-content)_,minmax(0,_max-content)] lg:grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] gap-x-4 gap-y-3"
            >
              <RadioGroupItem
                value="parcelNumber"
                label={
                  <div className="flex items-center gap-2 w-ma">
                    <p>Parcel Number</p>
                    <Tooltip
                      renderButton={<FaCircleInfo className="size-3.5 text-grey-200" />}
                      renderContent="This is the land's unique number assigned by the county and is the best way to locate your property."
                    />
                  </div>
                }
              />
              <RadioGroupItem
                value="fullName"
                label={
                  <div className="flex items-center gap-2 w-ma">
                    <p>Full Name</p>
                    <Tooltip
                      renderButton={<FaCircleInfo className="size-3.5 text-grey-200" />}
                      renderContent="The owner name registered to the land with the County."
                    />
                  </div>
                }
              />
              <RadioGroupItem
                value="entityName"
                label={
                  <div className="flex items-center gap-2 w-ma">
                    <p>Legal Entity</p>
                    <Tooltip
                      renderButton={<FaCircleInfo className="size-3.5 text-grey-200" />}
                      renderContent="The legal entity registered to the land with the County, such as an LLC, Inc, Corp, etc."
                    />
                  </div>
                }
              />
              <RadioGroupItem
                value="map"
                label={
                  <div className="flex items-center gap-2 w-ma">
                    <p>Search by Map</p>
                    <Tooltip
                      renderButton={<FaCircleInfo className="size-3.5 text-grey-200" />}
                      renderContent="You can easily locate any piece of land directly on the map. Simply click on it to access the details."
                    />
                  </div>
                }
              />
            </RadioGroup>
          </div>
          <div className="flex gap-3 flex-col">
            {watch("searchType") === "parcelNumber" && (
              <TextInput
                value={watch("parcelNumber") || ""}
                onChange={(e) => setValue("parcelNumber", e.target.value || undefined, { shouldValidate: true, shouldDirty: true })}
                label="Enter Parcel ID"
                disabled={disableSearch}
                error={!!errors.parcelNumber}
              />
            )}
            {watch("searchType") === "fullName" && (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <TextInput
                  value={watch("firstName") || ""}
                  onChange={(e) => setValue("firstName", e.target.value || undefined, { shouldValidate: true, shouldDirty: true })}
                  rootClassName="w-full"
                  label="First Name"
                  disabled={disableSearch}
                  error={!!errors.firstName}
                />
                <TextInput
                  value={watch("lastName") || ""}
                  onChange={(e) => setValue("lastName", e.target.value || undefined, { shouldValidate: true, shouldDirty: true })}
                  rootClassName="w-full"
                  label="Last Name"
                  disabled={disableSearch}
                  error={!!errors.lastName}
                />
              </div>
            )}
            {watch("searchType") === "entityName" && (
              <TextInput
                value={watch("entityName") || ""}
                onChange={(e) => setValue("entityName", e.target.value || undefined, { shouldValidate: true, shouldDirty: true })}
                label="Enter name of the entity"
                disabled={disableSearch}
                error={!!errors.entityName}
              />
            )}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <AutoComplete
                selectedValue={getState(watch("state"))?.value || null}
                options={states}
                placeholder="State"
                onValueChange={(value) => {
                  setValue("state", value || "", { shouldValidate: true, shouldDirty: true });
                  setValue("county", "", { shouldValidate: true, shouldDirty: true });
                }}
                disabled={disableSearch}
                error={!!errors.state}
              />
              <AutoComplete
                options={counties || []}
                placeholder="County"
                onValueChange={(item) => {
                  setValue("county", item || "", { shouldValidate: true, shouldDirty: true });
                }}
                selectedValue={getCounty(selectedState, watch("county"))?.short.value || null}
                disabled={!watch("state") || disableSearch}
                error={!!errors.county}
              />
            </div>
            <div className="w-full lg:mt-1 fixed bottom-0 left-0 border-t p-4 bg-grey-30 sm:border-0 sm:p-0 sm:bg-transparent sm:static z-10">
              <Button
                id="volt-search-btn"
                onClick={onSubmit}
                loading={isPending || (form.watch("searchType") === "map" && !searchMapRef)}
                disabled={form.watch("searchType") === "map" && !searchMapRef}
                className=" w-full"
              >
                {form.watch("searchType") === "map" ? "Search on Map" : "Search"}
              </Button>
            </div>
          </div>
          <div className="rounded-2xl space-y-3 md:hidden">
            <div className=" rounded-2xl" style={{ aspectRatio: "3/1.5" }}>
              <video controls width="100%" height="100%" className="w-full h-full" poster="/subnail.png" preload="metadata">
                <source
                  src="https://hjpblcir9dyus8x7.public.blob.vercel-storage.com/video-QpygzeA5DFEAdEKsmJD9zdki3xxwSe.mp4"
                  type="vihttps://hjpblcir9dyus8x7.public.blob.vercel-storage.com/video-QpygzeA5DFEAdEKsmJD9zdki3xxwSe.mp4deo/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <h2 className="text-sm px-2">
              To see the full capabilities of the Parcel Market visit the website with a{" "}
              <span className="font-semibold">Desktop device</span> or <span className="font-semibold">watch the video</span>
            </h2>
          </div>
          <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] items-center gap-3">
            <LuInfo className="size-6 text-gray-800" />
            <p className="font-medium text-sm text-gray-800">
              Your search information is automatically saved to your profile{" "}
              <Link
                id="volt-recent-search-link"
                href={routes.user.recentSearches.fullUrl}
                className="underline text-sm font-medium text-primary-main"
              >
                Data Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default VoltSearch;
