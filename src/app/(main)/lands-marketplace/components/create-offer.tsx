"use client";

import { InfoIcon1 } from "@/components/@new/icons/InfoIcons";
import Alert from "@/components/@new/shared/Alert";
import Divider from "@/components/@new/shared/Divider";
import Popper from "@/components/@new/shared/Popper";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import Button from "@/components/@new/shared/forms/Button";
import TextField from "@/components/@new/shared/forms/TextField";
import { makeOfferAction } from "@/server-actions/offer/actions";
import { MakeOfferModel } from "@/types/offer";
import { offerValidation } from "@/zod-validations/offer-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import SimpleBar from "simplebar-react";
import toast from "react-hot-toast";
import ResponsiveAcceptModal from "@/components/@new/shared/modals/ResponsiveAcceptModal";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import routes from "@/helpers/routes";
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
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const {
    handleSubmit,
    formState: { isSubmitted, errors },
    setValue,
    watch,
    getValues,
  } = useForm<MakeOfferModel>({
    resolver: zodResolver(offerValidation),
  });

  const createOfferAction = async (data: any) => {
    try {
      setPending(true);
      const result = await makeOfferAction({ ...data, sellingPropertyId: Number(sellingPropertyId) });
      if (result.error) {
        if (result.message) {
          toast.error(result.message);
        } else {
          toast.error("Offer request failed");
        }
        setOpen(false);
      } else {
        toast.success("Offer sent");
        router.replace(routes.landsMarketplace.fullUrl);
      }
    } catch (error) {
      toast.error("Offer request failed");
    } finally {
      setPending(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setOpen(true);
  });

  return (
    <>
      <ResponsiveAcceptModal
        title="Disclosure Notice"
        desc="This offer is for initial contact only and is not a binding contract. Please accept to proceed."
        handleClose={() => setOpen(false)}
        cancelLabel="Close"
        acceptLabel="Accept"
        onOk={async () => {
          await createOfferAction({ ...getValues() });
        }}
        onReject={() => setOpen(false)}
        open={open}
        pending={pending}
      />
      <div className="flex flex-col gap-8">
        <SimpleBar className={clsx("p-1 z-20", maxHeight)}>
          <div className="flex flex-col gap-8">
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
              <LabelWithTooltip
                error={!!errors.offerActiveForDays}
                label="Offer active for"
                description="How long the offer is good for. "
              />
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
        <div className="flex sm:justify-end gap-3 bg-white">
          <Button className="w-full sm:w-fit" variant="secondary">
            Close
          </Button>
          <Button className="w-full sm:w-fit" onClick={onSubmit}>
            Offer Price
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateOffer;
