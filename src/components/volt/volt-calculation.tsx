import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import React, { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import Image from "next/image";
import { IDecodedAccessToken } from "@/types/auth";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";
import { MapInteractionModel } from "@/types/common";
import { cn, isElementVisible } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import NoAuthorizationSvg from "../../../public/no-authorization.svg";
import VoltItem from "./volt-item";
import { Button } from "../ui/button";
import VoltItemMulti from "./volt-item-multi";
import { breakPoints } from "../../../tailwind.config";

interface VoltCalculationProps {
  values: VoltWrapperValuesModel;
  user: IDecodedAccessToken | null;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
  showAdditionalData?: boolean;
  setShowAdditionalData?: (value: boolean) => void;
}

const VoltCalculation: FC<VoltCalculationProps> = ({
  values,
  user,
  mapInteraction,
  setMpaInteraction,
  setShowAdditionalData,
  showAdditionalData,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.lg));

  const data = [
    // eslint-disable-next-line no-nested-ternary
    ...(isSmallDevice ? [] : showAdditionalData ? values.additionalDataResult?.propertiesUsedForCalculation || [] : []),
    ...(values.calculation?.propertiesUsedForCalculation || []),
  ].sort((a, b) => {
    const aPrice = a.data.pricePerAcreage || a.data.pricePerAcreage;
    const bPrice = b.data.pricePerAcreage || b.data.pricePerAcreage;

    return aPrice - bPrice;
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (mapInteraction.hoveredParcelNumber && values.calculation?.propertiesUsedForCalculation && values.additionalDataResult) {
      const data = [...values.calculation.propertiesUsedForCalculation, ...values.additionalDataResult.propertiesUsedForCalculation];

      const propertyId = data.find((el) => el.data.parcelNumberNoFormatting === mapInteraction.hoveredParcelNumber)?.data
        .parcelNumberNoFormatting;

      const isSellingProperty = propertyId === values.calculation?.parcelNumberNoFormatting;
      if (propertyId && !isElementVisible(`calculation-${propertyId}`, "volt-scroll") && !isSellingProperty) {
        document.getElementById(`calculation-${propertyId}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [
    mapInteraction.hoveredParcelNumber,
    values.additionalDataResult,
    values.calculation?.parcelNumberNoFormatting,
    values.calculation?.propertiesUsedForCalculation,
  ]);

  return (
    <>
      <div ref={ref} className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">Subject Parcel</h1>
          <h2 className="text-sm text-grey-800">This is the parcel of land that you searched.</h2>
        </div>
        <div className="flex flex-col gap-2">
          {/* {values.calculation && (
            <VoltItem
              isSellingProperty
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
                  zoom: true,
                }));
              }}
              id={`calculation-${values.calculation.id}`}
              data={{
                acreage: values.calculation.acreage,
                city: values.calculation.city,
                county: values.calculation.county,
                id: values.calculation.id,
                lat: values.calculation.lat,
                lon: values.calculation.lon,
                parcelNumber: values.calculation.parcelNumber,
                parcelNumberNoFormatting: values.calculation.parcelNumberNoFormatting,
                state: values.calculation.state,
                owner: values.calculation.owner,
              }}
              selected
              isHighlighted={
                mapInteraction.hoveredParcelNumber === values.calculation.parcelNumberNoFormatting ||
                mapInteraction.openPopperParcelNumber === values.calculation.parcelNumberNoFormatting
              }
            />
          )} */}
        </div>
      </div>
      <div className="space-y-3 lg:space-y-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">Recent Sales</h1>
          <h2 className="text-sm text-grey-800">
            Vacant land parcels that have sold in the past two years, within 10 miles of the subject parcel and are of similar acreage.
            Yellow shading and yellow pins indicate sales not used in VOLT&apos;s algorithms and may be considered qualified sales
          </h2>
        </div>
        {setShowAdditionalData && (
          <div className="bg-grey-50 rounded-xl p-3 space-y-4">
            <p className="text-grey-800 text-sm">If you need additional data for your research, you can switch to another mode.</p>
            <div className="bg-grey/10 rounded-lg p-0.5">
              <ul className="grid grid-cols-2 min-h-8">
                <li
                  className={cn(
                    "text-center text-sm h-full flex items-center justify-center cursor-pointer",
                    !showAdditionalData && "bg-white shadow-1 font-semibold rounded-lg"
                  )}
                  onClick={() => setShowAdditionalData(false)}
                >
                  Default
                </li>
                <li
                  onClick={() => setShowAdditionalData(true)}
                  className={cn(
                    "text-center text-sm h-full flex items-center justify-center cursor-pointer",
                    showAdditionalData && "bg-white shadow-1 font-semibold rounded-lg"
                  )}
                >
                  Additional Data
                </li>
              </ul>
            </div>
          </div>
        )}
        {user && user.isSubscribed && (
          <>
            <div className="bg-grey-50 border border-grey-100 rounded-xl p-3 space-y-4 lg:hidden">
              <p className="text-grey-800 text-sm">If you need additional data for your research, you can switch to another mode.</p>
              <div className="bg-grey/10 rounded-lg p-0.5">
                <ul className="">
                  <li className={cn("text-center text-sm h-full flex items-center justify-center cursor-pointer py-1.5 font-semibold")}>
                    View on desktop version
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* {data.map((property) => {
                if (property.isBulked) {
                  return (
                    <VoltItemMulti
                      onHover={(parcelNumberNoFormatting) => {
                        setMpaInteraction((prevData) => ({
                          ...prevData,
                          hoveredParcelNumber: parcelNumberNoFormatting,
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
                      onSelect={(parcelNumberNoFormatting) => {
                        setMpaInteraction((prevData) => ({
                          ...prevData,
                          openPopperParcelNumber: parcelNumberNoFormatting,
                          zoom: true,
                        }));
                      }}
                      data={property}
                      key={`calculation-${property.data.id}`}
                      highlightedItemParcelNumber={mapInteraction.hoveredParcelNumber}
                      selectedItemParcelNumber={mapInteraction.openPopperParcelNumber}
                      selected={mapInteraction.openPopperParcelNumber === property.data.id}
                    />
                  );
                }
                return (
                  <VoltItem
                    isAdditional={!property.data.isMedianValid}
                    isSellingProperty={false}
                    id={`calculation-${property.data.id}`}
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
                        zoom: true,
                      }));
                    }}
                    key={property.data.id}
                    data={{
                      ...property.data,
                    }}
                    isHighlighted={mapInteraction.hoveredParcelNumber === property.data.parcelNumberNoFormatting}
                    selected={mapInteraction.openPopperParcelNumber === property.data.parcelNumberNoFormatting}
                  />
                );
              })} */}
            </div>
          </>
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
            id="volt-calculation-subscribe-button"
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
