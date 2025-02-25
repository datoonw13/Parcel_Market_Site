"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { IPropertiesInteraction, VoltSearchModel } from "@/types/volt";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { voltSearchSchema } from "@/zod-validations/volt";
import { ResponseModel } from "@/types/common";
import { IMainPropertyBaseInfo } from "@/types/property";
import { z } from "zod";
import { IDecodedAccessToken } from "@/types/auth";
import VoltDesktop from "./volt-desktop";
import { breakPoints } from "../../../tailwind.config";
import VoltMobile from "./volt-mobile";

const VoltLayout = ({
  data,
  initialParams,
  user,
}: {
  data: ResponseModel<IMainPropertyBaseInfo[] | null> | null;
  initialParams: z.infer<typeof voltSearchSchema> | null;
  user: IDecodedAccessToken | null;
}) => {
  const { targetReached: isSm, detecting } = useMediaQuery(parseFloat(breakPoints.lg));
  const [propertiesInteraction, setPropertiesInteraction] = useState<IPropertiesInteraction>({ hover: null, popup: null });

  const form = useForm<VoltSearchModel>({
    resolver: zodResolver(voltSearchSchema),
    defaultValues: {
      ...initialParams,
      searchType: initialParams?.searchType || "fullName",
    },
  });

  useEffect(() => {
    if (initialParams) {
      form.reset(initialParams);

      // Manually mark all fields as dirty
      Object.keys(initialParams).forEach((fieldName) => {
        form.setValue(fieldName as keyof VoltSearchModel, initialParams[fieldName as keyof VoltSearchModel], { shouldDirty: true });
      });

      // Trigger validation if needed
      form.trigger();
    } else {
      const values = form.getValues();
      form.reset();
      // Manually mark all fields as dirty
      Object.keys(values).forEach((fieldName) => {
        form.setValue(fieldName as keyof VoltSearchModel, values[fieldName as keyof VoltSearchModel], { shouldDirty: true });
      });

      // Trigger validation if needed
      form.trigger();
    }
  }, [form, initialParams]);

  if (detecting) return null;

  return isSm ? (
    <VoltMobile
      data={data}
      form={form}
      user={user}
      propertiesInteraction={propertiesInteraction}
      setPropertiesInteraction={setPropertiesInteraction}
    />
  ) : (
    <VoltDesktop
      data={data}
      form={form}
      user={user}
      propertiesInteraction={propertiesInteraction}
      setPropertiesInteraction={setPropertiesInteraction}
    />
  );
};

export default VoltLayout;
