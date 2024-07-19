"use client";

import { saveSearchDataAction } from "@/server-actions/value-land/actions";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ISignInResponse } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import Button from "../../shared/forms/Button";

const SaveCalculationData = ({ user }: { user: ISignInResponse["payload"] | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const [saveDataPending, setSaveDataPending] = useState(false);

  const saveSearchData = useCallback(async () => {
    if (user) {
      setSaveDataPending(true);
      const { errorMessage } = await saveSearchDataAction();
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success("Search data successfully saved");
        router.replace(routes.valueLand.value.fullUrl);
      }
      setSaveDataPending(false);
    } else {
      params.set("from", routes.valueLand.value.fullUrl);
      router.replace(`${routes.auth.signIn.fullUrl}?${params.toString()}`);
    }
  }, [params, router, user]);
  

  useEffect(() => {
    if (params.get("from")) {
      saveSearchData();
    }
  }, [params, router, saveSearchData, searchParams]);

  return (
    (saveDataPending || !user) && (
      <Button onClick={saveSearchData} loading={saveDataPending} className="w-full sm:w-fit min-w-max">
        Save Search Data
      </Button>
    )
  );
};

export default SaveCalculationData;
