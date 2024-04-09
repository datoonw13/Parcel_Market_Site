"use client";

import Button from "@/components/shared/Button";
import LoadingCircle from "@/icons/LoadingCircle";
import { useLazyGetRegridQuery } from "@/lib/features/apis/propertyApi";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const PropertyFound = () => {
  const router = useRouter();
  const findProperty = useAppSelector((state) => state.findProperty);

  const [getRergid, { isLoading, data }] = useLazyGetRegridQuery();

  const getData = useCallback(async () => {
    try {
      if (findProperty.info) {
        await getRergid(findProperty.info).unwrap();
      }
    } catch (error) {
      router.push("/property/info");
    }
  }, [findProperty.info, getRergid, router]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="flex flex-col gap-10">
      {isLoading ? (
        <div className="w-[150px] m-auto mt-8">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <div className="relative w-full h-[315px] rounded-2xl">
            <Map data={data?.data} />
          </div>
          <div className="grid gap-6">
            {data?.data.map((el, i) => (
              <div className="flex items-center justify-between" key={el.properties.fields.parcelnumb}>
                <div className="flex items-center gap-2">
                  <p className="bg-green w-[24px] h-[24px] rounded-[50%] flex items-center justify-center text-dark-green-500 font-medium">
                    {i + 1}
                  </p>
                  <p className="text-grey-500 font-medium">Parcel Number: #{el.properties.fields.parcelnumb}</p>
                </div>
                <p className="text-green-600 font-medium">58.78 Acres</p>
              </div>
            ))}
          </div>
          <Button classNames="md:w-fit" onClick={() => router.push("/property/about")}>
            Tell us about your property
          </Button>
        </>
      )}
    </div>
  );
};

export default PropertyFound;
