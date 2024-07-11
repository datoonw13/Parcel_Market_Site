"use client";

import { InfoIcon1 } from "@/components/@new/icons/InfoIcons";
import Alert from "@/components/@new/shared/Alert";
import Divider from "@/components/@new/shared/Divider";
import Popper from "@/components/@new/shared/Popper";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import Button from "@/components/@new/shared/forms/Button";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import RadioButton from "@/components/@new/shared/forms/RadioButton";
import TextField from "@/components/@new/shared/forms/TextField";
import { MakeOfferModel } from "@/types/offer";
import { offerValidation } from "@/zod-validations/offer-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SimpleBar from "simplebar-react";

const LabelWithTooltip = ({ label, description, error }: { label: string; description: string; error?: boolean }) => (
  <div className="flex gap-1">
    <p className={clsx("font-medium", error && "text-error")}>{label}</p>
    <Popper
      disableSameWidth
      renderButton={(setReferenceElement, referenceElement) => (
        <Button
          onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
          variant="secondary"
          className="!outline-none !w-6 !h-6 !p-0"
        >
          <InfoIcon1 color="grey-600" />
        </Button>
      )}
      renderContent={(setReferenceElement) => (
        <div className="bg-black rounded-md py-1.5 px-3 text-xss text-white max-w-60 text-center">{description}</div>
      )}
    />
  </div>
);

const MakeOffer = ({ maxHeight }: { maxHeight?: string }) => {
  const [showAlert, setShowAlert] = useState(true);
  const [showInput, setShowInput] = useState({
    inspectionPeriodDays: false,
    closingCosts: false,
    contigencies: false,
    earnestMoney: false,
  });

  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<MakeOfferModel>({
    resolver: zodResolver(offerValidation),
  });

  const onSubmit = handleSubmit(
    (data) => {
      console.log(data);
    },
    (error) => console.log(error, 22)
  );

  console.log(watch());

  return (
    <div className="flex flex-col gap-8">
      <SimpleBar className={clsx("p-1 z-20", maxHeight)}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <LabelWithTooltip error={!!errors.price} label="Offer Price" description="" />
            <TextField
              onChange={(value) => setValue("price", Number(value), { shouldValidate: isSubmitted })}
              placeholder="Offer Price"
              type="number"
              value={watch("price") ? watch("price").toString() : ""}
            />
          </div>
          <div className="flex flex-col gap-3">
            <LabelWithTooltip
              label="Earnest Money"
              description="The deposit you are willing to put down on the land while under contract to close."
              error={!!errors.earnestMoney}
            />
            <div className="flex flex-col gap-4">
              <RadioButton
                name="earnest-money-none"
                onChange={() => {
                  setValue("earnestMoney", undefined, { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, earnestMoney: false });
                }}
                checked={!showInput.earnestMoney && !watch("earnestMoney")}
                label="None"
              />
              <RadioButton
                name="earnest-money-5"
                onChange={() => {
                  setValue("earnestMoney", 5, { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, earnestMoney: false });
                }}
                checked={!showInput.earnestMoney && watch("earnestMoney") === 5}
                label="5%"
              />
              <RadioButton
                name="earnest-money-10"
                onChange={() => {
                  setValue("earnestMoney", 10, { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, earnestMoney: false });
                }}
                checked={!showInput.earnestMoney && watch("earnestMoney") === 10}
                label="10%"
              />
              <RadioButton
                name="earnest-money-20"
                onChange={() => {
                  setValue("earnestMoney", 20, { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, earnestMoney: false });
                }}
                checked={!showInput.earnestMoney && watch("earnestMoney") === 20}
                label="20%"
              />
              <RadioButton
                name="earnest-money-other"
                onChange={() => {
                  setShowInput({ ...showInput, earnestMoney: true });
                }}
                checked={showInput.earnestMoney}
                label="Other"
              />
              {showInput.earnestMoney && (
                <TextField
                  placeholder="Type here"
                  value={watch("earnestMoney") ? watch("earnestMoney")?.toString() : ""}
                  type="number"
                  onChange={(value) => {
                    setValue("earnestMoney", Number(value), { shouldValidate: isSubmitted });
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <LabelWithTooltip
              label="Inspection Period"
              description="The amount of time you need to inspect the property and receive a full refund on your deposit should you not move forward with the sale."
            />
            <div className="flex flex-col gap-4">
              <RadioButton
                name="inspection-period-none"
                onChange={() => {
                  setValue("inspectionPeriodDays", undefined, { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, inspectionPeriodDays: false });
                }}
                checked={!showInput.inspectionPeriodDays && !watch("inspectionPeriodDays")}
                label="None"
              />
              <RadioButton
                name="inspection-period-5"
                onChange={() => {
                  setValue("inspectionPeriodDays", 10, { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, inspectionPeriodDays: false });
                }}
                checked={!showInput.inspectionPeriodDays && watch("inspectionPeriodDays") === 10}
                label="10 Days"
              />
              <RadioButton
                name="inspection-period-10"
                onChange={() => {
                  setValue("inspectionPeriodDays", 20, { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, inspectionPeriodDays: false });
                }}
                checked={!showInput.inspectionPeriodDays && watch("inspectionPeriodDays") === 20}
                label="20 Days"
              />
              <RadioButton
                name="inspection-period-20"
                onChange={() => {
                  setValue("inspectionPeriodDays", 30, { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, inspectionPeriodDays: false });
                }}
                checked={!showInput.inspectionPeriodDays && watch("inspectionPeriodDays") === 30}
                label="30 Days"
              />
              <RadioButton
                name="inspection-period-other"
                onChange={() => {
                  setShowInput({ ...showInput, inspectionPeriodDays: true });
                }}
                checked={showInput.inspectionPeriodDays}
                label="Other"
              />
              {showInput.inspectionPeriodDays && (
                <TextField
                  value={watch("inspectionPeriodDays") ? watch("inspectionPeriodDays")?.toString() : ""}
                  placeholder="Type here"
                  onChange={(value) => setValue("inspectionPeriodDays", Number(value), { shouldValidate: isSubmitted })}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <LabelWithTooltip
              label="Closing Period"
              description="The amount of time you need to close on the land. This includes the time for the inspection period, if any."
              error={!!errors.closingPeriodDays}
            />
            <div className="flex flex-col gap-4">
              <RadioButton
                name="closing-period-15"
                onChange={() => setValue("closingPeriodDays", 15, { shouldValidate: isSubmitted })}
                checked={watch("closingPeriodDays") === 15}
                label="15 Days"
              />
              <RadioButton
                name="closing-period-30"
                onChange={() => setValue("closingPeriodDays", 30, { shouldValidate: isSubmitted })}
                checked={watch("closingPeriodDays") === 30}
                label="30 Days"
              />
              <RadioButton
                name="closing-period-45"
                onChange={() => setValue("closingPeriodDays", 45, { shouldValidate: isSubmitted })}
                checked={watch("closingPeriodDays") === 45}
                label="45 Days"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <LabelWithTooltip
              label="Closing Costs"
              description="All closing costs, including but not limited to attorney's fees (both parties), commissions, transfer fees, taxes, title fees, etc."
            />
            <div className="flex flex-col gap-4">
              <RadioButton
                name="closing-costs-seller"
                onChange={() => {
                  setValue("closingCosts", "Seller Pays", { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, closingCosts: false });
                }}
                checked={!showInput.closingCosts && watch("closingCosts") === "Seller Pays"}
                label="Seller Pays"
              />
              <RadioButton
                name="closing-costs-split"
                onChange={() => {
                  setValue("closingCosts", "Split Equally", { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, closingCosts: false });
                }}
                checked={!showInput.closingCosts && watch("closingCosts") === "Split Equally"}
                label="Split Equally"
              />
              <RadioButton
                name="closing-costs-buyer"
                onChange={() => {
                  setValue("closingCosts", "Buyer Pays", { shouldValidate: isSubmitted });
                  setShowInput({ ...showInput, closingCosts: false });
                }}
                checked={!showInput.closingCosts && watch("closingCosts") === "Buyer Pays"}
                label="Buyer Pays"
              />
              <RadioButton
                name="closing-costs-other"
                onChange={() => setShowInput({ ...showInput, closingCosts: true })}
                checked={showInput.closingCosts}
                label="Other"
              />
              {showInput.closingCosts && (
                <TextField
                  value={watch("closingCosts") ?? ""}
                  onChange={(value) => setValue("closingCosts", value, { shouldValidate: isSubmitted })}
                  placeholder="Type here"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <LabelWithTooltip
              label="Contigencies"
              description="These are items the deal would be contingent on where buyer is due a full refund if not met."
            />
            <div className="flex flex-col gap-4">
              <CheckBox
                onChange={() => {
                  setShowInput({ ...showInput, contigencies: false });
                  setValue("contigencies", undefined, { shouldValidate: isSubmitted });
                }}
                checked={!showInput.contigencies && !watch("contigencies")}
                label="None"
              />
              <CheckBox
                onChange={() => {
                  setShowInput({ ...showInput, contigencies: false });
                  setValue("contigencies", "Title", { shouldValidate: isSubmitted });
                }}
                checked={!showInput.contigencies && watch("contigencies") === "Title"}
                label="Title"
              />
              <CheckBox
                onChange={() => {
                  setShowInput({ ...showInput, contigencies: false });
                  setValue("contigencies", "Financing", { shouldValidate: isSubmitted });
                }}
                checked={!showInput.contigencies && watch("contigencies") === "Financing"}
                label="Financing"
              />
              <CheckBox
                onChange={() => {
                  setShowInput({ ...showInput, contigencies: false });
                  setValue("contigencies", "Appraisal", { shouldValidate: isSubmitted });
                }}
                checked={!showInput.contigencies && watch("contigencies") === "Appraisal"}
                label="Appraisal"
              />
              <CheckBox
                onChange={() => setShowInput({ ...showInput, contigencies: true })}
                checked={showInput.contigencies}
                label="Other"
              />
              {showInput.contigencies && (
                <TextField
                  value={watch("contigencies") ?? ""}
                  onChange={(value) => setValue("contigencies", value, { shouldValidate: isSubmitted })}
                  placeholder="Type here"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <LabelWithTooltip error={!!errors.offerActiveForDays} label="Offer active for" description="How long the offer is good for. " />
            <div className="flex flex-col gap-4">
              <AutoComplete
                options={[3, 4, 5]}
                getOptionLabel={(item) => `${item} Day${item > 1 ? "s" : ""}`}
                getOptionKey={(item) => item.toString()}
                onChange={(item) => setValue("offerActiveForDays", item!, { shouldValidate: isSubmitted })}
                onFilter={(searchValue, items) => items}
                value={watch("offerActiveForDays") ?? null}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <LabelWithTooltip label="Other Terms" description="Provide any extra details you'd like to include in the offer" />
            <div className="flex flex-col gap-4">
              <TextField
                value={watch("otherTerms") ?? ""}
                onChange={(value) => setValue("otherTerms", value, { shouldValidate: isSubmitted })}
                placeholder="Type here"
              />
            </div>
          </div>
        </div>
      </SimpleBar>
      {showAlert && (
        <Alert
          onClose={() => setShowAlert(false)}
          type="info"
          title="Check your information"
          description="Please check your information one more time, before you submit. You won’t be able to edit, or send offer again, but you can contact to the seller and manage changes."
        />
      )}
      <Divider />
      <div className="flex justify-end gap-3 bg-white">
        <Button variant="secondary">Close</Button>
        <Button onClick={onSubmit}>Offer Price</Button>
      </div>
    </div>
  );
};

export default MakeOffer;
