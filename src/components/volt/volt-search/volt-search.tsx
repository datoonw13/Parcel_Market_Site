"use client";

import { FaCircleInfo } from "react-icons/fa6";
import { LuInfo } from "react-icons/lu";
import { RadioGroup } from "@radix-ui/react-radio-group";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllStates, getCounties, getCounty, getState } from "@/helpers/states";
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import { cn } from "@/lib/utils";
import { getPropertiesAction } from "@/server-actions/volt/actions";
import { VoltSearchModel, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import useStates from "@/hooks/useStates";
import { voltSearchSchema } from "../../../zod-validations/volt";
import { Tooltip } from "../../ui/tooltip";
import { RadioGroupItem } from "../../ui/radio-group";
import { TextInput } from "../../ui/input";
import { Button } from "../../ui/button";
import { AutoComplete } from "../../ui/autocomplete";
import VoltSearchAlerts from "./volt-search-alerts";

interface VoltSearchProps {
  user: IDecodedAccessToken | null;
  className?: string;
  onSuccess: () => void;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
  setSearchType: Dispatch<SetStateAction<VoltSearchModel["searchType"]>>;
  selectedSearchType: VoltSearchModel["searchType"];
  setMobileSearchMap?: () => void;
}

const VoltSearch: FC<VoltSearchProps> = ({
  user,
  className,
  onSuccess,
  setValues,
  values,
  setStep,
  selectedSearchType,
  setSearchType,
  setMobileSearchMap,
}) => {
  const params = useSearchParams();
  const router = useRouter();
  const searchParams = useMemo(() => new URLSearchParams(params as any), [params]);
  const [error, setError] = useState<"limit" | "notFound" | null>(null);
  const {
    handleSubmit,
    formState: { isSubmitted, isSubmitting, isValid },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<VoltSearchModel>({
    resolver: zodResolver(voltSearchSchema),
    defaultValues: {
      searchType: selectedSearchType,
    },
  });
  const { states, getCountiesByState, getCounty } = useStates();
  const selectedState = watch("state");
  const counties = getCountiesByState(selectedState);

  const disableSearch = !!(error === "limit");

  const onSearchTypeChange = (type: VoltSearchModel["searchType"]) => {
    setValue("searchType", type, { shouldValidate: true });
    setSearchType(type);
    if (isSubmitted) {
      trigger();
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setStep(VoltSteps.SEARCH);

    if (watch("searchType") === "map") {
      setMobileSearchMap && setMobileSearchMap();
      setValues((prev) => ({
        ...prev,
        additionalDataResult: null,
        calculation: null,
        searchResult: null,
        selectedItem: null,
        searchDetails: { ...data },
      }));
      return;
    }

    const { data: properties, errorMessage } = await getPropertiesAction(data);
    if (errorMessage) {
      setError(errorMessage === "Search limit exceeded for this month." ? "limit" : "notFound");
    } else {
      setValues((prev) => ({
        ...prev,
        searchDetails: { ...data },
        searchResult: properties,
        selectedItem: properties?.length === 1 ? properties[0] : null,
      }));
      onSuccess();
      if (error) {
        setError(null);
      }
    }
  });

  useEffect(() => {
    if (values.searchDetails) {
      reset({ ...values.searchDetails });
    }
  }, [reset, values.searchDetails]);

  useEffect(() => {
    if (searchParams.get("state") && searchParams.get("county")) {
      reset({
        ...values.searchDetails,
        searchType: "parcelNumber",
        state: searchParams.get("state")!,
        county: searchParams.get("county")!,
      });
      searchParams.delete("state");
      searchParams.delete("county");
      router.replace(`${routes.volt.fullUrl}?${searchParams.toString()}`);
    }
  }, [reset, router, searchParams, values.searchDetails]);

  return (
    <div className={cn("flex gap-6 flex-col-reverse lg:flex-col", className)}>
      <div className="flex flex-col gap-6">
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
            onValueChange={(value) => onSearchTypeChange(value as VoltSearchModel["searchType"])}
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
        <div className="flex gap-3 flex-col">
          {watch("searchType") === "parcelNumber" && (
            <TextInput
              value={watch("parcelNumber") || ""}
              onChange={(e) => setValue("parcelNumber", e.target.value || undefined, { shouldValidate: true })}
              label="Enter Parcel ID"
              disabled={disableSearch}
            />
          )}
          {watch("searchType") === "fullName" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <TextInput
                value={watch("firstName") || ""}
                onChange={(e) => setValue("firstName", e.target.value || undefined, { shouldValidate: true })}
                rootClassName="w-full"
                label="First Name"
                disabled={disableSearch}
              />
              <TextInput
                value={watch("lastName") || ""}
                onChange={(e) => setValue("lastName", e.target.value || undefined, { shouldValidate: true })}
                rootClassName="w-full"
                label="Last Name"
                disabled={disableSearch}
              />
            </div>
          )}
          {watch("searchType") === "entityName" && (
            <TextInput
              value={watch("entityName") || ""}
              onChange={(e) => setValue("entityName", e.target.value || undefined, { shouldValidate: true })}
              label="Enter name of the entity"
              disabled={disableSearch}
            />
          )}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <AutoComplete
              selectedValue={getState(watch("state"))?.value || null}
              options={states}
              placeholder="State"
              onValueChange={(value) => {
                setValue("state", value || "", { shouldValidate: true });
                setValue("county", "", { shouldValidate: true });
              }}
              disabled={disableSearch}
            />
            <AutoComplete
              options={counties || []}
              placeholder="County"
              onValueChange={(item) => {
                setValue("county", item || "", { shouldValidate: true });
              }}
              selectedValue={getCounty(selectedState, watch("county"))?.short.value || null}
              disabled={!watch("state") || disableSearch}
            />
          </div>
          <Button id="volt-search-btn" disabled={disableSearch || !isValid} loading={isSubmitting} onClick={onSubmit} className="mt-1">
            Search
          </Button>
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
              My Recent Searches
            </Link>
          </p>
        </div>
      </div>
      <VoltSearchAlerts error={error} setError={setError} />
    </div>
  );
};
export default VoltSearch;
