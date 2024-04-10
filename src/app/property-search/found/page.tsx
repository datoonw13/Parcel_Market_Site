"use client";

import Button from "@/components/shared/Button";
import LoadingCircle from "@/icons/LoadingCircle";
import { useLazyGetRegridQuery } from "@/lib/features/apis/propertyApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import dynamic from "next/dynamic";
import { setSelectedParcelNumber } from "@/lib/features/slices/findPropertySlice";

const Map = dynamic(() => import("@/components/property-search/Map"), { ssr: false });

const PropertyFound = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const findProperty = useAppSelector((state) => state.findProperty);

  const [getRergid, { isLoading, data }] = useLazyGetRegridQuery();

  const getData = useCallback(async () => {
    try {
      if (findProperty.info) {
        await getRergid(findProperty.info).unwrap();
      }
    } catch (error) {
      router.push("/property-search/info");
    }
  }, [findProperty.info, getRergid, router]);

  const handleParcelSelect = (parcelNumber: string) => {
    dispatch(setSelectedParcelNumber(parcelNumber));
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
            {data && (
              <Map data={data.data} selectedParcelNumber={findProperty.selectedParcelNumber} handleParcelSelect={handleParcelSelect} />
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
                  <p className="text-green-600 font-medium hidden sm:block">58.78 Acres</p>
                  <Button
                    disabled={findProperty.selectedParcelNumber === el.properties.fields.parcelnumb}
                    classNames="!py-2"
                    onClick={() => handleParcelSelect(el.properties.fields.parcelnumb)}
                  >
                    {findProperty.selectedParcelNumber === el.properties.fields.parcelnumb ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="fixed bottom-0 bg-white w-full drop-shadow-2xl shadow-2xl py-4 left-0 px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20">
            <Button
              disabled={!findProperty.selectedParcelNumber}
              classNames="md:w-fit h-fit"
              onClick={() => router.push("/property-search/about")}
            >
              Tell us about your property
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyFound;
