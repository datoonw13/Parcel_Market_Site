"use client";

import { InfoIcon1 } from "@/components/@new/icons/InfoIcons";
import Alert from "@/components/@new/shared/Alert";
import Divider from "@/components/@new/shared/Divider";
import Popper from "@/components/@new/shared/Popper";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import Button from "@/components/@new/shared/forms/Button";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import TextField from "@/components/@new/shared/forms/TextField";
import { makeOfferAction } from "@/server-actions/user/offers-actions";
import { MakeOfferModel } from "@/types/offer";
import { offerValidation } from "@/zod-validations/offer-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SimpleBar from "simplebar-react";
import OfferPriceField from "./offer-price-field";
import OfferEarnestMoneyField from "./offer-earnest-money-field";
import OfferInspectionPeriodField from "./offer-inspection-period-field";
import OfferClosingPeriodField from "./offer-closing-period-field";
import OfferClosingCostsField from "./offer-closing-costs-field";
import OfferContingenciesField from "./offer-contigencies-field";

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

const CreateOffer = ({ maxHeight, sellingPropertyId }: { maxHeight?: string; sellingPropertyId: any }) => {
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
    async (data) => {
      const result = await makeOfferAction({ ...data, sellingPropertyId: Number(sellingPropertyId) });
      console.log(result, 22);
    },
    (error) => console.log(error, 22)
  );

  console.log(watch());

  return (
    <div className="flex flex-col gap-8">
      <SimpleBar className={clsx("p-1 z-20", maxHeight)}>
        <div className="flex flex-col gap-8">
          <OfferPriceField
            onChange={(value) => setValue("price", value, { shouldValidate: isSubmitted })}
            error={!!errors.price}
          />
          <OfferEarnestMoneyField
            error={!!errors.earnestMoney}
            onChange={(value) => setValue("earnestMoney", value, { shouldValidate: isSubmitted })}
          />
          <OfferInspectionPeriodField
            error={!!errors.inspectionPeriodDays}
            onChange={(value) => setValue("inspectionPeriodDays", value, { shouldValidate: isSubmitted })}
          />
          <OfferClosingPeriodField
            error={!!errors.closingPeriodDays}
            value={watch("closingPeriodDays")}
            onChange={(value) => setValue("closingPeriodDays", value, { shouldValidate: isSubmitted })}
          />
          <OfferClosingCostsField
            error={!!errors.closingCosts}
            value={watch("closingCosts")}
            onChange={(value) => setValue("closingCosts", value, { shouldValidate: isSubmitted })}
          />
          <OfferContingenciesField
            error={!!errors.contigencies}
            value={watch("contigencies")}
            onChange={(value) => setValue("contigencies", value, { shouldValidate: isSubmitted })}
          />
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
      <Alert
        onClose={() => {}}
        type="info"
        title="Check your information"
        description="Please check your information one more time, before you submit. You won’t be able to edit, or send offer again, but you can contact to the seller and manage changes."
      />
      <Divider />
      <div className="flex justify-end gap-3 bg-white">
        <Button variant="secondary">Close</Button>
        <Button onClick={onSubmit}>Offer Price</Button>
      </div>
    </div>
  );
};

export default CreateOffer;
