"use client";

import { saveSearchDataAction } from "@/server-actions/value-land/actions";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IDecodedAccessToken, ISignInResponse } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { useAtom } from "jotai";
import { valueLandAtom } from "@/atoms/value-land-atom";
import Button from "../../shared/forms/Button";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import { InfoIcon2 } from "../../icons/InfoIcons";

const SaveCalculationData = ({ user }: { user: IDecodedAccessToken | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const [valueLand, setValueLand] = useAtom(valueLandAtom);
  const [saveDataPending, setSaveDataPending] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const saved = useRef(false);

  const saveSearchData = useCallback(async () => {
    if (user) {
      setSaveDataPending(true);
      const { errorMessage } = await saveSearchDataAction(valueLand.calculatedPrice!.id);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success("Search data successfully saved");
        router.replace(routes.valueLand.value.fullUrl);
      }
      setValueLand((prev) => ({ ...prev, searchDataSaved: true }));
      setSaveDataPending(false);
    } else {
      setOpenWarningModal(true);
    }
  }, [router, setValueLand, user, valueLand.calculatedPrice]);

  useEffect(() => {
    if (params.get("from") && !saved.current) {
      saveSearchData();
      saved.current = true;
    }
  }, [params, router, saveSearchData, searchParams]);

  return (
    !valueLand.searchDataSaved && (
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
