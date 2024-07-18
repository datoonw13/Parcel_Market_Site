import { valueLandAtom } from "@/atoms/value-land-atom";
import routes from "@/helpers/routes";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CheckValueLandData = () => {
  const valueLandData = useAtomValue(valueLandAtom);

  const router = useRouter();

  // useEffect(() => {
  //   if (!valueLandData.calculatedPrice) {
  //     router.replace(routes.valueLand.fullUrl);
  //   }
  // }, [router, valueLandData.calculatedPrice]);

  return null;
};

export default CheckValueLandData;
