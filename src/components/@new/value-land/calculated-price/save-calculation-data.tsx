"use client";

import { saveSearchDataAction } from "@/server-actions/value-land/actions";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ISignInResponse } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import Button from "../../shared/forms/Button";

const ACTION = "saveSearchData";

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
      }
      setSaveDataPending(false);
    } else {
      params.set("from", routes.valueLand.value.fullUrl);
      params.set("action", ACTION);
      router.replace(`${routes.auth.signIn.fullUrl}?${params.toString()}`);
    }
  }, [params, router, user]);

  useEffect(() => {
    if (searchParams.get("action") === ACTION && params.get("from") === routes.valueLand.value.fullUrl) {
      saveSearchData();
      router.replace(routes.valueLand.value.fullUrl);
    }
  }, [params, router, saveSearchData, searchParams]);

  return (
    <Button onClick={saveSearchData} loading={saveDataPending} className="w-full sm:w-fit min-w-max">
      Save Search Data
    </Button>
  );
};

export default SaveCalculationData;
