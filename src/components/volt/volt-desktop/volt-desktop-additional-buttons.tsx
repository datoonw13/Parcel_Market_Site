import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import { calculateLandPriceAction } from "@/server-actions/volt/actions";
import { IDecodedAccessToken } from "@/types/auth";
import { VoltPriceCalculationReq, VoltPriceCalculationRes, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import CalculationTermsDialog from "../calculation-terms/calculation-terms-dialog";

interface VoltDesktopAdditionalButtonsProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  values: VoltWrapperValuesModel;
  onSucceed: (data: VoltPriceCalculationRes | null) => void;
}
const VoltDesktopAdditionalButtons: FC<VoltDesktopAdditionalButtonsProps> = ({ step, values, user, onSucceed }) => {
  const router = useRouter();
  const { notify } = useNotification();
  const [calculationPending, setCalculationPending] = useState(false);
  const [showCalculationTerms, setShowCalculationTerms] = useState(false);

  const calculatePrice = async () => {
    if (!values.selectedItem) {
      return;
    }
    const reqData: VoltPriceCalculationReq = {
      body: {
        county: values.selectedItem?.properties.fields.county.toLocaleLowerCase(),
        state: values.selectedItem?.properties.fields.state2.toLocaleLowerCase(),
        parcelNumber: values.selectedItem?.properties.fields.parcelnumb,
        owner: values.selectedItem.properties.fields.owner,
        propertyType: values.selectedItem.properties.fields?.zoning_description || values.selectedItem.properties.fields.usedesc || "",
        coordinates: JSON.stringify(values.selectedItem.geometry.coordinates),
        locality: values.selectedItem.properties.fields.city,
      },
      queryParams: {
        acre: values.selectedItem.properties.fields.ll_gisacre.toString(),
        lat: values.selectedItem.properties.fields.lat,
        lon: values.selectedItem.properties.fields.lon,
      },
    };
    setCalculationPending(true);

    const { errorMessage, data } = await calculateLandPriceAction(reqData);
    if (errorMessage) {
      notify({ title: "Error", description: errorMessage }, { variant: "error" });
    } else {
      onSucceed(data);
    }
    setCalculationPending(false);
  };

  return (
    <>
      <CalculationTermsDialog
        onAccept={() => {
          setShowCalculationTerms(false);
          calculatePrice();
        }}
        open={showCalculationTerms}
        closeModal={() => setShowCalculationTerms(false)}
      />
      {step === VoltSteps.SEARCH_RESULTS && (
        <Button
          loading={calculationPending}
          onClick={() => {
            if (user) {
              calculatePrice();
            } else {
              setShowCalculationTerms(true);
            }
          }}
          disabled={!values.selectedItem}
          className="w-full"
        >
          Calculate Price
        </Button>
      )}
      {step === VoltSteps.CALCULATION && !user && (
        <Button
          className="w-full"
          onClick={() => {
            router.push(`${routes.auth.signIn.fullUrl}?redirect_uri=${routes.volt.fullUrl}`);
            sessionStorage.setItem("volt", JSON.stringify({ step, values }));
          }}
        >
          Save Data
        </Button>
      )}
    </>
  );
};

export default VoltDesktopAdditionalButtons;
