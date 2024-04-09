"use client";

import Button from "@/components/shared/Button";
import Select from "@/components/shared/Select";
import TextField from "@/components/shared/TextField";
import { setInfo } from "@/lib/features/slices/findPropertySlice";
import { useAppDispatch } from "@/lib/hooks";
import { IFindPropertyInfo } from "@/types/property";
import { findPropertyInfoSchema } from "@/validations/property-schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { usaStatesFull } from "typed-usa-states";

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

const PropertyInfo = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
    trigger,
  } = useForm<IFindPropertyInfo>({
    resolver: yupResolver(findPropertyInfoSchema),
    defaultValues: {
      county: null,
      owner: null,
      parcelNumber: null,
      state: null,
    },
  });

  const states = usaStatesFull
    .filter((el) => el.contiguous)
    .map((state) => ({ label: state.name, value: state.abbreviation.toLowerCase() }));
  const counties =
    usaStatesFull
      .find(({ abbreviation }) => abbreviation.toLowerCase() === watch("state"))
      ?.counties?.map((el) => ({ label: el, value: el.split(" ")[0].toLowerCase() })) || [];

  const onSubmit = handleSubmit((data) => {
    dispatch(setInfo(data));
    router.push("/property/found");
  });

  return (
    <div className="flex flex-col gap-6">
      <TextField
        name="owner"
        value={watch("owner") || ""}
        onChange={(value) => {
          setValue("owner", value, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
          isSubmitted && trigger("parcelNumber");
        }}
        error={!!errors.owner}
        helperText={errors.owner?.message}
        info="your info here"
        label="Name of the owner"
        placeholder="Enter name of the owner"
      />
      <div className="flex items-baseline gap-6">
        <Select
          options={getAllStates()}
          name="state"
          info="your info here"
          label="State"
          placeholder="State"
          error={!!errors.state}
          helperText={errors.state?.message}
          onChange={(value) => {
            setValue("state", value, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
            setValue("county", null);
          }}
          value={getStateValue(watch("state"))}
        />
        <Select
          options={getCounties(watch("state"))}
          value={getCountyValue(watch("county"), watch("state"))}
          name="county"
          info="your info here"
          label="County"
          placeholder="County"
          error={!!errors.county}
          helperText={errors.county?.message}
          disabled={!watch("state")}
          onChange={(value) => setValue("county", value?.split(" ")?.[0].toLowerCase() || "", { shouldDirty: true, shouldValidate: true })}
        />
      </div>
      <TextField
        name="parcelNumber"
        value={watch("parcelNumber") || ""}
        onChange={(value) => {
          if (/^-?\d+\.?\d*$/.test(value) || value === "") {
            setValue("parcelNumber", value === "" ? null : Number(value), { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
            isSubmitted && trigger("owner");
          }
        }}
        error={!!errors.parcelNumber}
        helperText={errors.parcelNumber?.message}
        info="your info here"
        label="Parcel Number"
        placeholder="Enter parcel Number"
      />
      <Button classNames="mt-4 md:w-fit" onClick={onSubmit}>
        Continue
      </Button>
    </div>
  );
};

export default PropertyInfo;
