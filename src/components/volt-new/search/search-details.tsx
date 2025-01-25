"use client";

import { FaCircleInfo } from "react-icons/fa6";
import routes from "@/helpers/routes";
import Link from "next/link";
import { LuInfo } from "react-icons/lu";
import { isDirty, z } from "zod";
import { propertySearchTypeValidation } from "@/zod-validations/volt-new";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStates from "@/hooks/useStates";
import { FC, useEffect, useMemo } from "react";
import { testReq } from "@/server-actions/new-volt/server-actions";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "../../ui/tooltip";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { TextInput } from "../../ui/input";
import { Button } from "../../ui/button";
import { AutoComplete } from "../../ui/autocomplete";

type ISearchDetails = z.infer<typeof propertySearchTypeValidation>;

interface IVoltDesktopSearchWrapper {
  formState: UseFormReturn<ISearchDetails, any, undefined>;
}

const VoltSearchDetails: FC<IVoltDesktopSearchWrapper> = ({ formState }) => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    handleSubmit,
    formState: { isDirty, isValid },
    setValue,
    watch,
    trigger,
    reset,
  } = formState;

  const { states, getCountiesByState, getCounty, getState } = useStates();
  const selectedState = watch("state");
  const counties = useMemo(() => getCountiesByState(selectedState), [getCountiesByState, selectedState]);

  const handleSearch = handleSubmit((data) => {
    if (data.searchType === "map") {
    } else {
      const searchParamsObj: { [key: string]: string } = {
        state: data.state,
        county: data.county,
        searchType: data.searchType,
      };
      if (data.searchType === "parcelNumber") {
        searchParamsObj.parcelNumber = data.parcelNumber!;
      }
      if (data.searchType === "entityName") {
        searchParamsObj.entityName = data.entityName!.toUpperCase();
      }
      if (data.searchType === "fullName") {
        searchParamsObj.firstName = data.firstName!;
        searchParamsObj.lastName = data.lastName!;
      }
      const searchParams = new URLSearchParams();
      Object.keys(searchParamsObj).forEach((key) => {
        searchParams.set(key, searchParamsObj[key]);
      });
      router.push(`${pathname}?${searchParams.toString()}`);
      reset({ ...data });
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Let’s locate your property using some basic information</h1>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <p className="text-grey-800 text-sm font-medium">Search By</p>
          <Tooltip
            renderButton={<FaCircleInfo className="size-3.5 text-grey-200" />}
            renderContent="What kind of criteria user needs to fill, or other info message"
          />
        </div>
        <RadioGroup
          onValueChange={(value) => {
            setValue("searchType", value as ISearchDetails["searchType"], { shouldValidate: true, shouldDirty: true });
            trigger();
          }}
          value={watch("searchType")}
          className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] sm:grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)_minmax(0,_max-content)] lg:grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] gap-x-4 gap-y-3"
        >
          <RadioGroupItem
            value="parcelNumber"
            label={
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
                <p>Search by Map</p>
                <Tooltip renderButton={<FaCircleInfo className="size-3.5 text-grey-200" />} renderContent="Some info." />
              </div>
            }
          />
        </RadioGroup>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3 flex-col">
          {watch("searchType") === "parcelNumber" && (
            <TextInput
              value={watch("parcelNumber") || ""}
              onChange={(e) => setValue("parcelNumber", e.target.value || undefined, { shouldValidate: true, shouldDirty: true })}
              label="Enter Parcel ID"
            />
          )}
          {watch("searchType") === "fullName" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <TextInput
                value={watch("firstName") || ""}
                onChange={(e) => setValue("firstName", e.target.value || undefined, { shouldValidate: true, shouldDirty: true })}
                rootClassName="w-full"
                label="Name"
              />
              <TextInput
                value={watch("lastName") || ""}
                onChange={(e) => setValue("lastName", e.target.value || undefined, { shouldValidate: true, shouldDirty: true })}
                rootClassName="w-full"
                label="Surname"
              />
            </div>
          )}
          {watch("searchType") === "entityName" && (
            <TextInput
              value={watch("entityName") || ""}
              onChange={(e) => setValue("entityName", e.target.value || undefined, { shouldValidate: true, shouldDirty: true })}
              label="Enter name of the entity"
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
            />
            <AutoComplete
              options={counties || []}
              placeholder="County"
              onValueChange={(item) => {
                setValue("county", item || "", { shouldValidate: true, shouldDirty: true });
              }}
              selectedValue={getCounty(selectedState, watch("county"))?.short.value || null}
              disabled={!watch("state")}
            />
          </div>
          <Button onClick={handleSearch} disabled={!isValid || !isDirty} id="volt-search-btn">
            {watch("searchType") === "map" ? "Search Map" : "Search"}
          </Button>
        </div>
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
  );
};

export default VoltSearchDetails;
