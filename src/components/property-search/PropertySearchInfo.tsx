"use client";

import Select from "@/components/shared/Select";
import TextField from "@/components/shared/TextField";
import { useAppDispatch } from "@/lib/hooks";
import { ISearchProperty } from "@/types/property";
import { useRouter } from "next/navigation";
import { FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch, useForm } from "react-hook-form";
import { usaStatesFull } from "typed-usa-states";
import { useState } from "react";
import CheckBox from "../shared/CheckBox";

const getAllStates = () =>
  usaStatesFull
    .filter((el) => el.contiguous)
    .map((state) => ({ label: state.name, value: state.abbreviation.toLowerCase(), counties: state.counties }));

const getCounties = (state: string | null) => {
  if (!state) {
    return [];
  }
  const counties = getAllStates().find(({ value }) => value === state)?.counties || [];
  const formattedCounties = counties.map((el) => ({ label: el, value: el.split(" ")[0].toLowerCase() }));
  return formattedCounties;
};

const getStateValue = (state: string | null) => {
  if (!state) {
    return null;
  }
  return getAllStates().find((el) => el.value === state) || null;
};

const getCountyValue = (county: string | null, state: string | null) => {
  if (!county || !state) {
    return null;
  }
  return getCounties(state).find(({ value }) => value === county) || null;
};

interface IPropertySearchInfo {
  setValue: UseFormSetValue<ISearchProperty>;
  trigger: UseFormTrigger<ISearchProperty>;
  errors: FieldErrors<ISearchProperty>;
  isSubmitted: boolean;
  watch: UseFormWatch<ISearchProperty>;
}

const PropertySearchInfo = ({ setValue, trigger, errors, isSubmitted, watch }: IPropertySearchInfo) => (
  <div className="flex flex-col gap-6">
    {watch("info.isLegalEntity") ? (
      <TextField
        value={watch("info.entityName") || ""}
        name="owner"
        onChange={(value) => {
          setValue("info.entityName", value || null, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
          isSubmitted && trigger("info.parcelNumber");
        }}
        error={!!errors?.info?.entityName}
        helperText={errors?.info?.entityName?.message}
        info="your info here"
        label="Name of the entity"
        placeholder="Enter name of the entity"
        disabled={!!watch("info.parcelNumber")}
      />
    ) : (
      <div className="flex items-baseline gap-6 w-full">
        <TextField
          fullWidth
          value={watch("info.firstName") || ""}
          name="firstName"
          onChange={(value) => {
            setValue("info.firstName", value || null, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
            isSubmitted && trigger("info.parcelNumber");
          }}
          error={!!errors?.info?.firstName}
          helperText={errors?.info?.firstName?.message}
          info="your info here"
          label="First name"
          placeholder="Enter first name"
          disabled={!!watch("info.parcelNumber")}
        />
        <TextField
          fullWidth
          value={watch("info.lastName") || ""}
          name="lastName"
          onChange={(value) => {
            setValue("info.lastName", value || null, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
            isSubmitted && trigger("info.parcelNumber");
          }}
          error={!!errors?.info?.lastName}
          helperText={errors?.info?.lastName?.message}
          info="your info here"
          label="Last name"
          placeholder="Enter last name"
          disabled={!!watch("info.parcelNumber")}
        />
      </div>
    )}
    <CheckBox
      label="Legal Entity"
      disabled={!!watch("info.parcelNumber")}
      onChange={() => {
        setValue("info.isLegalEntity", !watch("info.isLegalEntity"));
        setValue("info.entityName", null, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
        setValue("info.firstName", null, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
        setValue("info.lastName", null, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
      }}
      checked={watch("info.isLegalEntity")}
      classNames="ml-auto"
    />
    <div className="flex items-baseline gap-6">
      <Select
        value={getStateValue(watch("info.state"))}
        options={getAllStates()}
        name="state"
        info="your info here"
        label="State"
        placeholder="State"
        error={!!errors?.info?.state}
        helperText={errors?.info?.state?.message}
        onChange={(value) => {
          setValue("info.state", value, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
          setValue("info.county", null);
        }}
      />
      <Select
        options={getCounties(watch("info.state"))}
        value={getCountyValue(watch("info.county"), watch("info.state"))}
        name="county"
        info="your info here"
        label="County"
        placeholder="County"
        error={!!errors?.info?.county}
        helperText={errors?.info?.county?.message}
        disabled={!watch("info.state")}
        onChange={(value) =>
          setValue("info.county", value?.split(" ")?.[0].toLowerCase() || "", { shouldDirty: true, shouldValidate: true })
        }
      />
    </div>
    <TextField
      name="parcelNumber"
      value={watch("info.parcelNumber") || ""}
      onChange={(value) => {
        if (!value.includes(" ")) {
          setValue("info.parcelNumber", value === "" ? null : value, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
          isSubmitted && trigger("info.entityName");
          isSubmitted && trigger("info.firstName");
          isSubmitted && trigger("info.lastName");
        }
      }}
      error={!!errors?.info?.parcelNumber}
      helperText={errors?.info?.parcelNumber?.message}
      info="your info here"
      label="Parcel Number"
      placeholder="Enter parcel Id"
    />
  </div>
);

export default PropertySearchInfo;
