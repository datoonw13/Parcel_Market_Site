"use client";

import { getAllStates, getCounties, getCountyValue, getStateValue } from "@/helpers/states";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { valueLandDetailsValidations } from "@/zod-validations/value-land-validations";
import { z } from "zod";
import { getFoundedPropertiesAction } from "@/server-actions/value-land/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { useSetAtom } from "jotai";
import { valueLandAtom } from "@/atoms/value-land-atom";
import Button from "../shared/forms/Button";
import RadioButton from "../shared/forms/RadioButton";
import LabelWithInfo from "../shared/label-with-info";
import AutoComplete from "../shared/forms/AutoComplete";
import TextField from "../shared/forms/TextField";
import Alert from "../shared/Alert";

type LandDetailsModel = z.infer<typeof valueLandDetailsValidations>;

const ValueLandDetails = () => {
  const router = useRouter();
  const setValueLandAtom = useSetAtom(valueLandAtom);
  const [showError, setShowError] = useState(false);
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<LandDetailsModel>({
    resolver: zodResolver(valueLandDetailsValidations),
    defaultValues: {
      type: "parcelNumber",
    },
  });

  const handleSearchBy = (type: LandDetailsModel["type"]) => {
    setValue("type", type, { shouldValidate: isSubmitted });
    if (isSubmitted) {
      trigger();
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const { data: foundedProperties, errorMessage } = await getFoundedPropertiesAction(data);
    if (errorMessage) {
      setShowError(true);
    } else {
      setValueLandAtom((prev) => ({
        ...prev,
        lands: foundedProperties,
        selectedLand: foundedProperties?.length === 1 ? foundedProperties[0] : null,
      }));
      router.push(routes.valueLand.found.fullUrl);
    }
  });

  return (
    <div className="space-y-8 h-full justify-between gap-2 flex flex-col">
      <div className="mx-4 md:mx-6 lg:mx-8 lg:p-6 xl:p-8 lg:border lg:border-grey-100 rounded-2xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <LabelWithInfo
              iconClassName="!fill-grey-200"
              labelClassName="text-sm text-grey-800"
              label="Search By"
              description="What king of criteria user needs to fill, or other info message"
            />
            <div className="flex flex-col sm:flex-row gap-5">
              <RadioButton
                checked={watch("type") === "parcelNumber"}
                name="parcelNumber"
                onChange={() => handleSearchBy("parcelNumber")}
                label={
                  <LabelWithInfo
                    iconClassName="!fill-grey-200"
                    labelClassName="text-base text-grey-800"
                    label="Parcel Number"
                    description="What king of criteria user needs to fill, or other info message"
                  />
                }
              />
              <RadioButton
                checked={watch("type") === "fullName"}
                name="fullName"
                onChange={() => handleSearchBy("fullName")}
                label={
                  <LabelWithInfo
                    iconClassName="!fill-grey-200"
                    labelClassName="text-base text-grey-800"
                    label="Full Name"
                    description="The owner name registered to the land with the County."
                  />
                }
              />
              <RadioButton
                checked={watch("type") === "entityName"}
                name="entityName"
                onChange={() => handleSearchBy("entityName")}
                label={
                  <LabelWithInfo
                    iconClassName="!fill-grey-200"
                    labelClassName="text-base text-grey-800"
                    label="Legal Entity"
                    description="The legal entity registered to the land with the County, such as an LLC, Inc, Corp, etc."
                  />
                }
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {watch("type") === "parcelNumber" && (
                <TextField
                  label="Enter parcel ID"
                  value={watch("parcelNumber") || ""}
                  onChange={(value) => setValue("parcelNumber", value, { shouldValidate: isSubmitted })}
                  error={!!errors.parcelNumber}
                />
              )}
              {watch("type") === "entityName" && (
                <TextField
                  label="Enter name of the entity"
                  value={watch("entityName") || ""}
                  onChange={(value) => setValue("entityName", value, { shouldValidate: isSubmitted })}
                  error={!!errors.entityName}
                />
              )}
              {watch("type") === "fullName" && (
                <>
                  <TextField
                    label="First name"
                    onChange={(value) => setValue("firstName", value, { shouldValidate: isSubmitted })}
                    value={watch("firstName")}
                    error={!!errors.firstName}
                  />
                  <TextField
                    label="Last name"
                    onChange={(value) => setValue("lastName", value, { shouldValidate: isSubmitted })}
                    value={watch("lastName")}
                    error={!!errors.lastName}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <AutoComplete
                rootClassName="w-full"
                options={getAllStates({ filterBlackList: true })}
                getOptionLabel={(item) => item.label}
                getOptionKey={(item) => item.value}
                onChange={(item) => {
                  setValue("state", item?.value || "", { shouldValidate: isSubmitted });
                  setValue("county", "", { shouldValidate: isSubmitted });
                }}
                placeholder="State"
                value={getStateValue(watch("state"))}
                onFilter={(searchValue, items) =>
                  items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                }
                getSelectedOption={(item) => item.value === watch("state")}
                error={!!errors.state}
              />
              <AutoComplete
                rootClassName="w-full"
                options={getCounties(watch("state"))}
                getOptionLabel={(item) => item.label}
                getOptionKey={(item) => item.value}
                disabled={!watch("state")}
                onChange={(item) => {
                  setValue("county", item?.value || "", { shouldValidate: isSubmitted });
                }}
                placeholder="County"
                value={getCountyValue(watch("county"), watch("state"))}
                onFilter={(searchValue, items) =>
                  items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                }
                getSelectedOption={(item) => item.value === watch("county")}
                error={!!errors.county}
              />
            </div>
          </div>
          {showError && (
            <Alert
              type="warning"
              description="Please check your information and try again."
              title="We could not find your property."
              onClose={() => setShowError(false)}
            />
          )}
        </div>
      </div>
      <div className="border-t border-t-grey-100 flex flex-col sm:flex-row justify-end gap-3 px-4 md:px-6 lg:px-8 py-4">
        {/* <Button variant="secondary">Back</Button> */}
        <Button onClick={onSubmit} loading={isSubmitting}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ValueLandDetails;