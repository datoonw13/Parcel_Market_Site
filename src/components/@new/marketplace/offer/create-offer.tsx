import { MakeOfferModel } from "@/types/offer";
import { offerValidation } from "@/zod-validations/offer-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SimpleBar from "simplebar-react";
import { createOfferAction } from "@/server-actions/offer/actions";
import toast from "react-hot-toast";
import OfferPriceField from "./offer-price-field";
import Button from "../../shared/forms/Button";
import OfferEarnestMoneyField from "./offer-earnest-money-field";
import OfferInspectionPeriodField from "./offer-inspection-period-field";
import OfferClosingPeriodField from "./offer-closing-period-field";
import OfferClosingCostsField from "./offer-closing-costs-field";
import OfferContingenciesField from "./offer-contigencies-field";
import LabelWithInfo from "../../shared/label-with-info";
import AutoComplete from "../../shared/forms/AutoComplete";
import TextField from "../../shared/forms/TextField";
import Alert from "../../shared/Alert";

const CreateOffer = ({ sellingPropertyId, goBack }: { sellingPropertyId: number; goBack: () => void }) => {
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting },
    setValue,
    watch,
  } = useForm<MakeOfferModel>({
    resolver: zodResolver(offerValidation),
  });

  const createOffer = handleSubmit(async (data) => {
    const { errorMessage } = await createOfferAction({ ...data, sellingPropertyId });
    if (errorMessage) {
      toast.error(errorMessage, { duration: 3000 });
    } else {
      toast.success("Offer sent successfully");
      goBack();
    }
  });

  return (
    <div className="overflow-hidden grid w-full">
      <div className="flex overflow-hidden">
        <SimpleBar className="w-full">
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
              <LabelWithInfo error={!!errors.offerActiveForDays} label="Offer active for" description="How long the offer is good for. " />
              <div className="flex flex-col gap-4">
                <AutoComplete
                  contentClassName="z-20"
                  options={[3, 4, 5]}
                  getOptionLabel={(item) => `${item} Day${item > 1 ? "s" : ""}`}
                  getOptionKey={(item) => item.toString()}
                  onChange={(item) => {
                    if (item) {
                      const value = item as 3 | 4 | 5;
                      setValue("offerActiveForDays", value, { shouldValidate: isSubmitted });
                    }
                  }}
                  onFilter={(searchValue, items) => items}
                  value={watch("offerActiveForDays") ?? null}
                />
              </div>
            </div>
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
          </div>
        </SimpleBar>
      </div>
      <div className="my-8 mx-4 md:mx-8">
        <Alert
          type="info"
          title="Check your information"
          description="Please check your information one more time, before you submit. You won’t be able to edit, or send offer again, but you can contact to the seller and manage changes."
          onClose={() => {}}
        />
      </div>
      <div className="px-4 md:px-8 border-t border-t-grey-100 py-4 flex justify-center sm:justify-end gap-3">
        <Button className="w-full sm:w-fit" variant="secondary" onClick={goBack}>
          Close
        </Button>
        <Button className="w-full sm:w-fit" loading={isSubmitting} onClick={createOffer}>
          Offer Price
        </Button>
      </div>
    </div>
  );
};

export default CreateOffer;
