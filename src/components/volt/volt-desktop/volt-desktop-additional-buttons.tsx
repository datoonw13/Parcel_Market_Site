import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import { calculateLandPriceAction } from "@/server-actions/volt/actions";
import { IDecodedAccessToken } from "@/types/auth";
import { IVoltPriceCalculationReqParams, IVoltPriceCalculationRes, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import CalculationTermsDialog from "../calculation-terms/calculation-terms-dialog";

interface VoltDesktopAdditionalButtonsProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  values: VoltWrapperValuesModel;
  onSucceed: (data: IVoltPriceCalculationRes | null) => void;
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
    const reqData: IVoltPriceCalculationReqParams = {
      body: {
        county: values.selectedItem?.county.value,
        state: values.selectedItem?.state.value,
        parcelNumber: values.selectedItem?.parcelNumberNoFormatting,
        owner: values.selectedItem.owner,
        propertyType: values.selectedItem.propertyType || "",
        coordinates: JSON.stringify(values.selectedItem.polygon),
        locality: values.selectedItem.city,
      },
      queryParams: {
        acre: values.selectedItem.acreage.toString(),
        lat: values.selectedItem.lat.toString(),
        lon: values.selectedItem.lon.toString(),
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
