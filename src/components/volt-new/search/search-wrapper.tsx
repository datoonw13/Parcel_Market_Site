"use client";

import { propertySearchTypeValidation } from "@/zod-validations/volt-new";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, ReactNode, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useSearchParams } from "next/navigation";
import VoltDesktopSearchWrapper from "./search-wrapper-desktop";
import { breakPoints } from "../../../../tailwind.config";

type ISearchDetails = z.infer<typeof propertySearchTypeValidation>;

interface IVoltSearchWrapper {
  children: ReactNode;
}

const VALID_SEARCH_PARAMS_KEY = ["searchType", "parcelNumber", "firstName", "lastName", "entityName", "state", "county"];

const VoltSearchWrapper: FC<IVoltSearchWrapper> = ({ children }) => {
  const params = useSearchParams();
  const { targetReached: isSmallDevice, detecting } = useMediaQuery(parseFloat(breakPoints.lg));

  const formState = useForm<ISearchDetails>({
    resolver: zodResolver(propertySearchTypeValidation),
    defaultValues: {
      searchType: "parcelNumber",
    },
  });

  const setInitialValues = useCallback(async () => {
    const searchParamsObj = Object.fromEntries(new URLSearchParams(params.toString()));
    const searchParamsObjFiltered = Object.keys(searchParamsObj)
      .filter((el) => VALID_SEARCH_PARAMS_KEY.includes(el))
      .reduce((acc, cur) => ({ ...acc, [cur]: searchParamsObj[cur] }), {});
    const validationResult = await propertySearchTypeValidation.safeParseAsync(searchParamsObjFiltered);

    if (validationResult.data) {
      formState.reset({ ...validationResult.data });
    }
  }, [params, formState]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  return !detecting && <>{!isSmallDevice && <VoltDesktopSearchWrapper formState={formState}>{children}</VoltDesktopSearchWrapper>}</>;
};

export default VoltSearchWrapper;
