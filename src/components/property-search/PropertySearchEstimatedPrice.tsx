"use client";

import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import routes from "@/helpers/routes";
import ArrowIcon from "@/icons/ArrowIcon";
import LoadingCircle from "@/icons/LoadingCircle";
import SearchLandingIcon from "@/icons/SearchLandingIcon";
import UsdLandingIcon from "@/icons/UsdLandingIcon";
import propertyApi, { useCalculatePriceQuery } from "@/lib/features/apis/propertyApi";
import { setSelectedParcelNumber } from "@/lib/features/slices/authedUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { IMapItem } from "@/types/map";
import { ISearchProperty, ISearchPropertyCalculatePrice } from "@/types/property";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UseFormWatch } from "react-hook-form";
import toast from "react-hot-toast";

interface IPropertySearchEstimatedPrice {
  watch: UseFormWatch<ISearchProperty>;
  selectedRegridItem: IMapItem;
  reset: () => void;
}

const PropertySearchEstimatedPrice = ({ watch, selectedRegridItem, reset }: IPropertySearchEstimatedPrice) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.authedUser.user);

  const getReqData = (): ISearchPropertyCalculatePrice => {
    const reqData: ISearchPropertyCalculatePrice = {
      body: {
        ...watch("about"),
        county: watch("info.county"),
        state: watch("info.state"),
        parcelNumber: watch("found.parcelNumber") || "",
        owner: selectedRegridItem.properties.fields.owner,
        improvementsValue: watch("about.improvementsValue") || 0,
      },
      queryParams: {
        acre: selectedRegridItem.properties.fields.ll_gisacre.toString(),
        lat: selectedRegridItem.properties.fields.lat,
        lon: selectedRegridItem.properties.fields.lon,
        propertyType: selectedRegridItem.properties.fields.zoning_description,
      },
    };

    return reqData;
  };

  const { isFetching, data, isError } = useCalculatePriceQuery({ ...getReqData() });

  const handleSubmit = () => {
    dispatch(setSelectedParcelNumber(watch("found.parcelNumber")));
    if (!user) {
      router.push(routes.auth.signIn);
    } else {
      router.push(routes.propertySearch.signature);
    }
  };

  useEffect(() => {
    if (isError) {
      reset();
    }
  }, [reset, isError]);

  useEffect(() => {
    if (data?.data.price === 0) {
      toast.error("Price calculation failed....");
      reset();
    }
  }, [data?.data.price, reset]);

  return (
    <div className="flex flex-col gap-10">
      {isFetching ? (
        <div className="w-[150px] m-auto mt-8">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <div className="bg-green-100 flex flex-col items-center py-10 px-4 md:px-6 lg:px-8 xl:px-10 rounded-2xl">
            <h1 className="text-dark-green font-bold text-6xl">${data?.data?.price}</h1>
            <p className="text-dark-green font-semibold my-4">30-45 days to close</p>
            <div className="w-[35px] mb-6">
              <ArrowIcon />
            </div>
            <div className="w-full">
              <div style={{ background: "linear-gradient(270deg, #F59E0B 0%, #17DB66 100%)" }} className="h-[10px] rounded-lg w-full" />
              <div className="flex justify-between mt-4">
                <p className="text-dark-green text-2xl font-semibold">${data?.data.range.min}</p>
                <p className="text-dark-green text-2xl font-semibold">${data?.data.range.max}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] xl:grid-cols-[1fr_2.3fr]">
            <Button onClick={handleSubmit} classNames="w-full h-fit">
              Sell your property NOW
            </Button>
            <p className="text-grey-500 font-medium text-xl text-center lg:text-start lg:max-w-[400px]">
              Sell your property NOW, hassle free and no closing costs for $57,000
            </p>
          </div>
          <Divider label="OR" />
          <div className="grid gap-10 grid-cols-1 xl:grid-cols-2">
            <div className="bg-neutral-300 hover:bg-neutral transition-all rounded-3xl cursor-pointer flex flex-col justify-between items-center gap-6 p-6">
              <div className="w-[64px]">
                <SearchLandingIcon />
              </div>
              <p className="text-grey-500 text-xl font-medium text-center">Submit your property to our network of investors.</p>
              <Button classNames="w-fit bg-neutral-500 hover:bg-neutral-700 text-grey-500 hover:text-grey-500">Submit your property</Button>
            </div>
            <div className="bg-neutral-300 hover:bg-neutral transition-all rounded-3xl cursor-pointer flex flex-col justify-between items-center gap-6 p-6">
              <div className="w-[64px]">
                <UsdLandingIcon />
              </div>
              <p className="text-grey-500 text-xl font-medium text-center">
                Get top dollar by working with a preferred real estate broker.
              </p>
              <Button classNames="w-fit bg-neutral-500 hover:bg-neutral-700 text-grey-500 hover:text-grey-500">Connect to a broker</Button>
            </div>
          </div>
          <p style={{ fontSize: 10 }} className="cursor-pointer">
            See our Terms of Service and Privacy Policy
          </p>
        </>
      )}
    </div>
  );
};

export default PropertySearchEstimatedPrice;
