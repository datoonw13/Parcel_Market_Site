import Button from "@/components/shared/Button";
import LoadingCircle from "@/icons/LoadingCircle";
import { useLazyGetRegridQuery } from "@/lib/features/apis/propertyApi";
import { useCallback, useEffect } from "react";

import dynamic from "next/dynamic";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ISearchProperty } from "@/types/property";

const Map = dynamic(() => import("@/components/property-search/Map"), { ssr: false });

interface IPropertySearchFound {
  setValue: UseFormSetValue<ISearchProperty>;
  watch: UseFormWatch<ISearchProperty>;
  onError: () => void;
}

const PropertySearchFound = ({ setValue, watch, onError }: IPropertySearchFound) => {
  const [getRegrid, { isLoading, data }] = useLazyGetRegridQuery();

  const getData = useCallback(async () => {
    const { entityName, firstName, lastName, isLegalEntity, ...rest } = { ...watch("info") };
    const reqData = {
      ...rest,
      owner: isLegalEntity
        ? entityName?.trim().replaceAll(" ", "").toUpperCase() || ""
        : `${firstName?.trim().replaceAll(" ", "").toUpperCase()}${lastName?.trim().replaceAll(" ", "").toUpperCase()}`,
    };
    try {
      await getRegrid({ ...reqData }).unwrap();
    } catch (error) {
      onError();
    }
  }, [getRegrid, onError, watch]);

  const handleParcelSelect = (parcelNumber: string) => {
    setValue("found.parcelNumber", parcelNumber, { shouldValidate: true });
  };

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
            {data && <Map data={data.data} selectedParcelNumber={watch("found.parcelNumber")} handleParcelSelect={handleParcelSelect} />}
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
                  <p className="text-green-600 font-medium hidden sm:block">58.78 Acres</p>
                  <Button
                    disabled={watch("found.parcelNumber") === el.properties.fields.parcelnumb}
                    classNames="!py-2"
                    onClick={() => handleParcelSelect(el.properties.fields.parcelnumb)}
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
