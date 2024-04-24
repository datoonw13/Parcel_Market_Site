import Button from "@/components/shared/Button";
import LoadingCircle from "@/icons/LoadingCircle";
import { useLazyGetRegridQuery } from "@/lib/features/apis/propertyApi";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

import dynamic from "next/dynamic";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ICalculatePriceReq, ISearchProperty, ISearchPropertyInfo } from "@/types/property";
import { IMapItem } from "@/types/map";

const Map = dynamic(() => import("@/components/property-search/Map"), { ssr: false });

interface IPropertySearchFound {
  setValue: UseFormSetValue<ISearchProperty>;
  watch: UseFormWatch<ISearchProperty>;
  onError: () => void;
  setSelectedRegridItem: Dispatch<SetStateAction<IMapItem | null>>;
}

const PropertySearchFound = ({ setValue, watch, onError, setSelectedRegridItem }: IPropertySearchFound) => {
  const [getRegrid, { isLoading, data }] = useLazyGetRegridQuery();

  const getData = useCallback(async () => {
    const { county, state, entityName, firstName, isLegalEntity, lastName, parcelNumber } = { ...watch("info") };
    if (parcelNumber === data?.data[0].properties.fields.parcelnumb) {
      return;
    }
    if (county && state) {
      const reqData: ICalculatePriceReq = {
        county,
        state,
      };
      if (parcelNumber) {
        reqData.parcelNumber = parcelNumber;
      } else if (isLegalEntity && entityName) {
        reqData.owner = entityName.toUpperCase();
      } else if (!isLegalEntity && firstName && lastName) {
        reqData.owner = `${firstName} ${lastName}`.toUpperCase();
      } else {
        return;
      }
      try {
        await getRegrid({ ...reqData }).unwrap();
      } catch (error) {
        onError();
      }
    }
  }, [data?.data, getRegrid, onError, watch]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="flex flex-col gap-10 pb-20">
      {isLoading ? (
        <div className="w-[150px] m-auto mt-8">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <div className="relative w-full h-[315px] rounded-2xl">
            {data && (
              <Map
                data={data.data}
                selectedParcelNumber={watch("found.parcelNumber")}
                handleParcelSelect={(parcel) => {
                  setValue("found.parcelNumber", parcel.properties.fields.parcelnumb, { shouldValidate: true });
                  setSelectedRegridItem(parcel);
                }}
              />
            )}
          </div>
          <div className="grid gap-6">
            {data?.data.map((el, i) => (
              <div className="flex items-center justify-between gap-8" key={el.properties.fields.parcelnumb}>
                <div className="flex items-center gap-4">
                  <p className="bg-green w-[28px] min-w-[28px] h-[28px] rounded-[50%] flex items-center justify-center text-dark-green-500 font-medium">
                    {i + 1}
                  </p>
                  <p className="text-grey-500 font-medium">Parcel Number: #{el.properties.fields.parcelnumb}</p>
                </div>
                <div className="flex items-center gap-8">
                  <p className="text-green-600 font-medium hidden sm:block">{el.properties.fields.ll_gisacre.toFixed(2)} Acres</p>
                  <Button
                    disabled={watch("found.parcelNumber") === el.properties.fields.parcelnumb}
                    classNames="!py-2"
                    onClick={() => {
                      setValue("found.parcelNumber", el.properties.fields.parcelnumb, { shouldValidate: true });
                      setSelectedRegridItem(el);
                    }}
                  >
                    {watch("found.parcelNumber") === el.properties.fields.parcelnumb ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertySearchFound;
