"use client";

import { FaCircleInfo } from "react-icons/fa6";
import { LuInfo } from "react-icons/lu";
import { RadioGroup } from "@radix-ui/react-radio-group";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllStates, getCounties, getCountyValue, getStateValue } from "@/helpers/states";
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import { cn } from "@/lib/utils";
import { getPropertiesAction } from "@/server-actions/volt/actions";
import { VoltSearchModel, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { voltSearchSchema } from "../../../zod-validations/volt";
import { Tooltip } from "../../ui/tooltip";
import { RadioGroupItem } from "../../ui/radio-group";
import { TextInput } from "../../ui/input";
import { Button } from "../../ui/button";
import { AutoComplete } from "../../ui/autocomplete";
import { Alert } from "../../ui/alert";
import VoltSearchAlerts from "./volt-search-alerts";

interface VoltSearchProps {
  user: IDecodedAccessToken | null;
  className?: string;
  onSuccess: () => void;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
}

const VoltSearch: FC<VoltSearchProps> = ({ user, className, onSuccess, setValues, values, setStep }) => {
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<VoltSearchModel>({
    resolver: zodResolver(voltSearchSchema),
    defaultValues: {
      searchType: "parcelNumber",
    },
  });

  const selectedState = watch("state");
  const states = useMemo(() => getAllStates({ filterBlackList: true }).map(({ counties, ...rest }) => rest), []);
  const counties = useMemo(() => getCounties(selectedState), [selectedState]);
  const showUnauthorizedUserAlert = !user && watch("searchType") !== "parcelNumber";
  const disableSearch = !!(showUnauthorizedUserAlert || error);

  const onSearchTypeChange = (type: VoltSearchModel["searchType"]) => {
    setValue("searchType", type, { shouldValidate: isSubmitted });
    if (isSubmitted) {
      trigger();
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setStep(VoltSteps.SEARCH);
    const { data: properties, errorMessage } = await getPropertiesAction(data);
    if (errorMessage) {
      setError(errorMessage);
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

  return (
    <div className={cn("space-y-6", className)}>
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
        </RadioGroup>
      </div>
      <div className="flex gap-3 flex-col">
        {watch("searchType") === "parcelNumber" && (
          <TextInput
            value={watch("parcelNumber") || ""}
            onChange={(e) => setValue("parcelNumber", e.target.value, { shouldValidate: isSubmitted })}
            error={!!errors.parcelNumber}
            label="Enter Parcel ID"
            disabled={disableSearch}
          />
        )}
        {watch("searchType") === "fullName" && (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <TextInput
              value={watch("firstName") || ""}
              onChange={(e) => setValue("firstName", e.target.value, { shouldValidate: isSubmitted })}
              error={!!errors.firstName}
              rootClassName="w-full"
              label="Name"
              disabled={disableSearch}
            />
            <TextInput
              value={watch("lastName") || ""}
              onChange={(e) => setValue("lastName", e.target.value, { shouldValidate: isSubmitted })}
              error={!!errors.lastName}
              rootClassName="w-full"
              label="Surname"
              disabled={disableSearch}
            />
          </div>
        )}
        {watch("searchType") === "entityName" && (
          <TextInput
            value={watch("entityName") || ""}
            onChange={(e) => setValue("entityName", e.target.value, { shouldValidate: isSubmitted })}
            error={!!errors.entityName}
            label="Enter name of the entity"
            disabled={disableSearch}
          />
        )}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <AutoComplete
            options={states}
            placeholder="State"
            error={!!errors.state}
            onValueChange={(item) => {
              setValue("state", item?.value || "", { shouldValidate: isSubmitted });
              setValue("county", "", { shouldValidate: isSubmitted });
            }}
            value={getStateValue(watch("state"))}
            disabled={disableSearch}
          />
          <AutoComplete
            options={counties}
            placeholder="County"
            onValueChange={(item) => {
              setValue("county", item?.value || "", { shouldValidate: isSubmitted });
            }}
            value={getCountyValue(watch("county"), watch("state"))}
            disabled={!watch("state") || disableSearch}
            error={!!errors.county}
          />
        </div>
        <Button disabled={disableSearch} loading={isSubmitting} onClick={onSubmit} className="mt-1">
          Search
        </Button>
      </div>
      <div className="grid grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)] items-center gap-3">
        <LuInfo className="size-6 text-gray-800" />
        <p className="font-medium text-sm text-gray-800">
          Your search information is automatically saved to your profile{" "}
          <Link href="/" className="underline text-sm font-medium text-primary-main">
            My Recent Searches
          </Link>
        </p>
      </div>
      <VoltSearchAlerts error={error} setError={setError} showUnauthorizedUserAlert={showUnauthorizedUserAlert} />
    </div>
  );
};
export default VoltSearch;
