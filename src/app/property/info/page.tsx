"use client";

import Button from "@/components/shared/Button";
import Select from "@/components/shared/Select";
import TextField from "@/components/shared/TextField";
import { IFindPropertyInfo } from "@/types/property";
import { findPropertyInfoSchema } from "@/validations/property-schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { usaStatesFull } from "typed-usa-states";

const PropertyInfo = () => {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
    trigger,
  } = useForm<IFindPropertyInfo>({
    resolver: yupResolver(findPropertyInfoSchema),
    defaultValues: {
      county: "",
      name_owner: "",
      parcelNumber: "",
      state: "",
    },
  });

  const states = usaStatesFull.filter((el) => el.contiguous);
  const counties = usaStatesFull.find((el) => el.name === watch("state"))?.counties?.map((el) => ({ label: el, value: el })) || [];

  const onSubmit = handleSubmit((data) => {
    router.push("/property/found");
  });

  return (
    <div className="flex flex-col gap-6">
      <TextField
        name="name_owner"
        value={watch("name_owner")}
        onChange={(value) => {
          setValue("name_owner", value, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
          isSubmitted && trigger("parcelNumber");
        }}
        error={!!errors.name_owner}
        helperText={errors.name_owner?.message}
        info="your info here"
        label="Name of the owner"
        placeholder="Enter name of the owner"
      />
      <div className="flex items-baseline gap-6">
        <Select
          options={states.map((el) => ({ label: el.name, value: el.name }))}
          name="state"
          info="your info here"
          label="State"
          placeholder="State"
          error={!!errors.state}
          helperText={errors.state?.message}
          onChange={(value) => {
            setValue("state", value || "", { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
            setValue("county", "");
          }}
          value={watch("state") ? { label: watch("state"), value: watch("state") } : null}
        />
        <Select
          options={counties}
          value={watch("county") ? { label: watch("county"), value: watch("county") } : null}
          name="county"
          info="your info here"
          label="County"
          placeholder="County"
          error={!!errors.county}
          helperText={errors.county?.message}
          disabled={!watch("state")}
          onChange={(value) => setValue("county", value || "", { shouldDirty: true, shouldValidate: true })}
        />
      </div>
      <TextField
        name="parcelNumber"
        value={watch("parcelNumber")}
        onChange={(value) => {
          setValue("parcelNumber", value, { shouldDirty: isSubmitted, shouldValidate: isSubmitted });
          isSubmitted && trigger("name_owner");
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
