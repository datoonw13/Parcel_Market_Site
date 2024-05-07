import Button from "@/components/shared/Button";
import LoadingCircle from "@/icons/LoadingCircle";
import propertyApi, { useCheckParcelSellingStatusMutation, useGetRegridQuery } from "@/lib/features/apis/propertyApi";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

import dynamic from "next/dynamic";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ICalculatePriceReq, ISearchProperty, ISearchPropertyInfo } from "@/types/property";
import { IMapItem } from "@/types/map";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";

const Map = dynamic(() => import("@/components/property-search/Map"), { ssr: false });

interface IPropertySearchFound {
  setValue: UseFormSetValue<ISearchProperty>;
  watch: UseFormWatch<ISearchProperty>;
  onError: () => void;
  setSelectedRegridItem: Dispatch<SetStateAction<IMapItem | null>>;
  reset: () => void;
}

const PropertySearchFound = ({ setValue, watch, onError, setSelectedRegridItem, reset }: IPropertySearchFound) => {
  const dispatch = useAppDispatch();
  // const [checkParcel, { isLoading: checkLoading }] = useCheckParcelSellingStatusMutation();
  const reqData = useCallback(() => {
    const { county, state, entityName, firstName, isLegalEntity, lastName, parcelNumber } = { ...watch("info") };
    const data: ICalculatePriceReq = {
      county: county || "",
      state: state || "",
    };
    if (parcelNumber) {
      data.parcelNumber = parcelNumber;
    } else if (isLegalEntity && entityName) {
      data.owner = entityName.toUpperCase();
    } else if (!isLegalEntity && firstName && lastName) {
      data.owner = `${lastName} ${firstName}`.toUpperCase();
    }
    return data;
  }, [watch]);

  const { isFetching, isLoading, data, isError, refetch } = useGetRegridQuery({ ...reqData() }, {});

  const handleSelect = async (item: IMapItem) => {
    // try {
    //   const { data } = await checkParcel(item.properties.fields.parcelnumb).unwrap();
    //   if (!data.data) {
    //     toast.error("Parcel sell already requested...");
    //     return;
    //   }
    //   setSelectedRegridItem(item);
    //   setValue("found.parcelNumber", item.properties.fields.parcelnumb, { shouldValidate: true });
    // } catch (error) {
    //   toast.error("Something went wrong...");
    // }
    setSelectedRegridItem(item);
    setValue("found.parcelNumber", item.properties.fields.parcelnumb, { shouldValidate: true });
  };

  useEffect(() => {
    if (isError) {
      reset();
      dispatch(propertyApi.util.resetApiState());
    }
  }, [dispatch, isError, reset]);

  return (
    <div className="flex flex-col gap-10 pb-20">
      {isLoading || isFetching ? (
        <div className="w-[150px] m-auto mt-8">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <div className="relative w-full h-[315px] rounded-2xl">
            {data && <Map data={data.data} selectedParcelNumber={watch("found.parcelNumber")} handleParcelSelect={handleSelect} />}
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
                    // loading={checkLoading}
                    onClick={() => {
                      handleSelect(el);
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
