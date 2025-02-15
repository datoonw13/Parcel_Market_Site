"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useState } from "react";
import { VoltSearchModel } from "@/types/volt";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { voltSearchSchema } from "@/zod-validations/volt";
import { ResponseModel } from "@/types/common";
import { IMainPropertyBaseInfo } from "@/types/property";
import VoltDesktop from "./volt-desktop";
import { breakPoints } from "../../../tailwind.config";

const VoltLayout = ({ data }: { data: ResponseModel<IMainPropertyBaseInfo[] | null> | null }) => {
  const { targetReached: isSm, detecting } = useMediaQuery(parseFloat(breakPoints.lg));
  const form = useForm<VoltSearchModel>({
    resolver: zodResolver(voltSearchSchema),
    defaultValues: {
      searchType: "fullName",
    },
  });

  if (detecting) return null;

  return isSm ? "mobile" : <VoltDesktop data={data} form={form} user={null} />;
};

export default VoltLayout;
