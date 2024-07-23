"use client";

import { saveSearchDataAction } from "@/server-actions/value-land/actions";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ISignInResponse } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import Button from "../../shared/forms/Button";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import { CheckIcon1, CheckIcon2 } from "../../icons/CheckIcons";
import { InfoIcon2 } from "../../icons/InfoIcons";

const SaveCalculationData = ({ user }: { user: ISignInResponse["payload"] | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const [saveDataPending, setSaveDataPending] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);

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
      setOpenWarningModal(true);
    }
  }, [router, user]);

  useEffect(() => {
    if (params.get("from")) {
      saveSearchData();
    }
  }, [params, router, saveSearchData, searchParams]);

  return (
    (saveDataPending || !user) && (
      <>
        <ResponsiveWarningModal
          customIcon={<InfoIcon2 className="!w-4 !h-4" color="primary-main" />}
          open={openWarningModal}
          variant="success"
          closeModal={() => setOpenWarningModal(false)}
          onOK={() => {
            params.set("from", routes.valueLand.value.fullUrl);
            router.replace(`${routes.auth.signIn.fullUrl}?${params.toString()}`);
          }}
          onCancel={() => setOpenWarningModal(false)}
          title="Log in to See the information"
          description="Your are not logged in, if you want to see this information please log into your account"
          okLabel="Log In"
          cancelLabel="Close"
        />
        <Button onClick={saveSearchData} loading={saveDataPending} className="w-full sm:w-fit min-w-max">
          Save Search Data
        </Button>
      </>
    )
  );
};

export default SaveCalculationData;
