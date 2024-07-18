"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import routes from "@/helpers/routes";
import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

const ValueLandCheckData = () => {
  const valueLandData = useAtomValue(valueLandAtom);
  const pathname = usePathname();
  const router = useRouter();

  const handleCheck = useCallback(() => {
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
  }, [pathname, router, valueLandData.calculatedPrice, valueLandData.lands, valueLandData.selectedLand]);

  useEffect(() => {
    handleCheck();
  }, [handleCheck]);

  return null;
};

export default ValueLandCheckData;
