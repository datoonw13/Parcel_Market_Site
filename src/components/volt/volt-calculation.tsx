import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import React, { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import Image from "next/image";
import { IDecodedAccessToken } from "@/types/auth";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";
import { MapInteractionModel } from "@/types/common";
import { isElementVisible } from "@/lib/utils";
import NoAuthorizationSvg from "../../../public/no-authorization.svg";
import VoltItem from "./volt-item";
import { Button } from "../ui/button";

interface VoltCalculationProps {
  values: VoltWrapperValuesModel;
  user: IDecodedAccessToken | null;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}

const VoltCalculation: FC<VoltCalculationProps> = ({ values, user, mapInteraction, setMpaInteraction }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (
      (mapInteraction.hoveredParcelNumber || mapInteraction.openPopperParcelNumber) &&
      !isElementVisible(`calculation-${mapInteraction.hoveredParcelNumber}`, "volt-scroll")
    ) {
      document
        .getElementById(`calculation-${mapInteraction.hoveredParcelNumber}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [mapInteraction.hoveredParcelNumber, mapInteraction.openPopperParcelNumber]);

  return (
    <>
      <div ref={ref} className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">Subject Parcel</h1>
          <h2 className="text-sm text-grey-800">This is the parcel of land that you searched.</h2>
        </div>
        <div className="flex flex-col gap-2">
          {values.selectedItem && (
            <VoltItem
              onHover={(property) => {
                setMpaInteraction((prevData) => ({
                  ...prevData,
                  hoveredParcelNumber: property.parcelNumberNoFormatting,
                  zoom: true,
                }));
              }}
              onMouseLeave={() => {
                setMpaInteraction((prevData) => ({
                  ...prevData,
                  hoveredParcelNumber: null,
                  zoom: false,
                }));
              }}
              onSelect={(property) => {
                setMpaInteraction((prevData) => ({
                  ...prevData,
                  openPopperParcelNumber: property.parcelNumberNoFormatting,
                  zoom: false,
                }));
              }}
              id={`calculation-${values.selectedItem.id}`}
              data={{
                ...values.selectedItem,
              }}
              selected
              isHighlighted={
                mapInteraction.hoveredParcelNumber === values.selectedItem.parcelNumberNoFormatting ||
                mapInteraction.openPopperParcelNumber === values.selectedItem.parcelNumberNoFormatting
              }
            />
          )}
        </div>
      </div>
      <div className="space-y-3 lg:space-y-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">Recent Sales</h1>
          <h2 className="text-sm text-grey-800">
            These are vacant land parcels that have sold in the past two years, within 10 miles of the subject parcel and are of similar
            acreage.
          </h2>
        </div>
        {user && user.isSubscribed && (
          <div className="flex flex-col gap-2">
            {values.calculation?.propertiesUsedForCalculation.map((property) => (
              <VoltItem
                id={`calculation-${property.id}`}
                onHover={(property) => {
                  setMpaInteraction((prevData) => ({
                    ...prevData,
                    hoveredParcelNumber: property.parcelNumberNoFormatting,
                    zoom: true,
                  }));
                }}
                onMouseLeave={() => {
                  setMpaInteraction((prevData) => ({
                    ...prevData,
                    hoveredParcelNumber: null,
                    zoom: false,
                  }));
                }}
                onSelect={(property) => {
                  setMpaInteraction((prevData) => ({
                    ...prevData,
                    openPopperParcelNumber: property.parcelNumberNoFormatting,
                    zoom: false,
                  }));
                }}
                key={property.id}
                data={{
                  ...property,
                }}
                isHighlighted={mapInteraction.hoveredParcelNumber === property.parcelNumberNoFormatting}
                selected={mapInteraction.openPopperParcelNumber === property.parcelNumberNoFormatting}
              />
            ))}
          </div>
        )}
      </div>
      {(!user || !user.isSubscribed) && (
        <div className="py-6 px-4 rounded-xl border border-primary-main-400 space-y-4 flex flex-col justify-center items-center">
          <div className="relative size-16 ">
            <Image src={NoAuthorizationSvg} alt="" fill className="w-full h-full" />
          </div>
          <div>
            <p className="text-center font-semibold">Please sign in or subscribe to see sales data</p>
            <p className="text-center text-grey-800 text-sm">
              You will need to sign in or subscribe to view, analyze, or export sales data
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              router.push(
                `${user && !user?.isSubscribed ? routes.user.subscription.fullUrl : routes.auth.signIn.fullUrl}?redirect_uri=${
                  routes.volt.fullUrl
                }`
              );
              sessionStorage.setItem("volt", JSON.stringify({ step: VoltSteps.CALCULATION, values }));
            }}
          >
            Continue
          </Button>
        </div>
      )}
    </>
  );
};

export default VoltCalculation;
