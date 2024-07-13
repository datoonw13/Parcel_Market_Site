"use client";

import { getAllStates } from "@/helpers/states";
import { IUserSignUp } from "@/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { valueLandDetailsValidations } from "@/zod-validations/value-land-validations";
import { z } from "zod";
import Button from "../shared/forms/Button";
import RadioButton from "../shared/forms/RadioButton";
import LabelWithInfo from "../shared/label-with-info";
import AutoComplete from "../shared/forms/AutoComplete";
import TextField from "../shared/forms/TextField";

type LandDetailsModel = z.infer<typeof valueLandDetailsValidations>;

const LandDetails = () => {
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

  const onSubmit = handleSubmit(
    (data) => console.log(data),
    (error) => console.log(error, 22)
  );

  return (
    <div className="space-y-8">
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
                />
              )}
              {watch("type") === "entityName" && (
                <TextField
                  label="Enter name of the entity"
                  value={watch("entityName") || ""}
                  onChange={(value) => setValue("entityName", value, { shouldValidate: isSubmitted })}
                />
              )}
              {watch("type") === "fullName" && (
                <>
                  <TextField label="First name" />
                  <TextField label="Last name" />
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <AutoComplete
                rootClassName="w-full"
                options={getAllStates()}
                getOptionLabel={(item) => item.label}
                getOptionKey={(item) => item.value}
                onChange={(item) => {}}
                placeholder="State"
                value={null}
                onFilter={(searchValue, items) =>
                  items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                }
                // required
                // getSelectedOption={(item) => item.value === watch("state")}
                // error={!!errors.state}
              />
              <AutoComplete
                rootClassName="w-full"
                options={getAllStates()}
                getOptionLabel={(item) => item.label}
                getOptionKey={(item) => item.value}
                onChange={(item) => {}}
                placeholder="County"
                value={null}
                onFilter={(searchValue, items) =>
                  items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                }
                // required
                // getSelectedOption={(item) => item.value === watch("state")}
                // error={!!errors.state}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-t-grey-100 flex flex-col sm:flex-row justify-end gap-3 px-4 md:px-6 lg:px-8 py-4">
        {/* <Button variant="secondary">Back</Button> */}
        <Button onClick={onSubmit}>Continue</Button>
      </div>
    </div>
  );
};

export default LandDetails;
