"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import routes from "@/helpers/routes";
import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ValueLandCheckData = () => {
  const valueLandData = useAtomValue(valueLandAtom);
  const pathname = usePathname();
  const router = useRouter();

  const handleCheck = () => {
    if (pathname === routes.valueLand.found.fullUrl && !valueLandData.lands) {
      router.replace(routes.valueLand.fullUrl);
    }
    if (pathname === routes.valueLand.value.fullUrl && (!valueLandData.lands || !valueLandData.selectedLand)) {
      router.replace(routes.valueLand.fullUrl);
    }
    if (
      pathname === routes.valueLand.about.fullUrl &&
      (!valueLandData.lands || !valueLandData.selectedLand || !valueLandData.calculatedPrice)
    ) {
      router.replace(routes.valueLand.fullUrl);
    }
    if (
      pathname === routes.valueLand.terms.fullUrl &&
      (!valueLandData.lands || !valueLandData.selectedLand || !valueLandData.calculatedPrice || !valueLandData.aboutLand)
    ) {
      router.replace(routes.valueLand.fullUrl);
    }
  };

  useEffect(() => {
    // handleCheck();
  }, []);

  return null;
};

export default ValueLandCheckData;
