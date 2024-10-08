import { MakeOfferModel } from "@/types/offer";
import { offerValidation } from "@/zod-validations/offer-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SimpleBar from "simplebar-react";
import OfferPriceField from "./offer-price-field";
import Button from "../../shared/forms/Button";
import OfferEarnestMoneyField from "./offer-earnest-money-field";
import OfferInspectionPeriodField from "./offer-inspection-period-field";
import OfferClosingPeriodField from "./offer-closing-period-field";
import OfferClosingCostsField from "./offer-closing-costs-field";
import OfferContingenciesField from "./offer-contigencies-field";
import LabelWithInfo from "../../shared/label-with-info";
import AutoComplete from "../../shared/forms/AutoComplete";
import TextField from "../../shared/forms/text-field";
import Alert from "../../shared/Alert";
import SendOfferButton from "./send-offer-button";

const CreateOffer = ({ sellingPropertyId, goBack }: { sellingPropertyId: number; goBack: () => void }) => {
  const {
    handleSubmit,
    formState: { isSubmitted, errors },
    setValue,
    watch,
    getValues,
  } = useForm<MakeOfferModel>({
    resolver: zodResolver(offerValidation),
    defaultValues: {
      offerActiveForDays: 3,
    },
  });

  return (
    <div className="overflow-hidden grid w-full">
      <div className="flex overflow-hidden">
        <SimpleBar className="w-full py-2 z-10">
          <div className="flex flex-col gap-8 px-4 md:px-8">
            <OfferPriceField onChange={(value) => setValue("price", value, { shouldValidate: isSubmitted })} error={!!errors.price} />
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
              onChange={(value) => setValue("closingPeriodDays", value, { shouldValidate: isSubmitted })}
            />
            <OfferClosingCostsField
              error={!!errors.closingCosts}
              value={watch("closingCosts")}
              onChange={(value) => setValue("closingCosts", value, { shouldValidate: isSubmitted })}
            />
            <OfferContingenciesField
              error={!!errors.contigencies}
              values={watch("contigencies")}
              onChange={(value) => {
                setValue("contigencies", value, { shouldValidate: isSubmitted });
              }}
            />
            <div className="flex flex-col gap-3">
              <LabelWithInfo label="Other Terms" description="Provide any extra details you'd like to include in the offer" />
              <div className="flex flex-col gap-4">
                <TextField
                  value={watch("otherTerms") ?? ""}
                  onChange={(value) => setValue("otherTerms", value, { shouldValidate: isSubmitted })}
                  placeholder="Type here"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <LabelWithInfo error={!!errors.offerActiveForDays} label="Offer active for" description="How long the offer is good for. " />
              <div className="flex flex-col gap-4">
                <AutoComplete
                  contentClassName="z-20"
                  options={new Array(14).fill(0).map((_, i) => i + 1)}
                  getOptionLabel={(item) => `${item} Day${item > 1 ? "s" : ""}`}
                  getOptionKey={(item) => item.toString()}
                  onChange={(item) => {
                    if (item) {
                      const value = item as MakeOfferModel["offerActiveForDays"];
                      setValue("offerActiveForDays", value, { shouldValidate: isSubmitted });
                    }
                  }}
                  onFilter={(_, items) => items}
                  value={watch("offerActiveForDays") ?? null}
                />
              </div>
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="my-8 mx-4 md:mx-8">
        <Alert
          type="info"
          title="Check your information"
          description="Please make sure your information is correct before submitting. You will not be able to edit any information on this form once submitted. However, if a change is needed, you can contact the seller to manage any changes."
          onClose={() => {}}
        />
      </div>
      <div className="px-4 md:px-8 border-t border-t-grey-100 py-4 flex justify-center sm:justify-end gap-3">
        <Button className="w-full sm:w-fit" variant="secondary" onClick={goBack}>
          Close
        </Button>
        <SendOfferButton
          onClick={(openWarningModal) => {
            handleSubmit(() => {
              openWarningModal();
            })();
          }}
          sellingPropertyId={sellingPropertyId}
          data={getValues()}
          goBack={goBack}
        />
      </div>
    </div>
  );
};

export default CreateOffer;
