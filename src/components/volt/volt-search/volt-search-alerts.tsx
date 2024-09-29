"use client";

import { Alert } from "@/components/ui/alert";
import useMediaQuery from "@/hooks/useMediaQuery";
import useNotification from "@/hooks/useNotification";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";

interface VoltSearchAlertsProps {
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  showUnauthorizedUserAlert: boolean;
}

const errors = {
  unauthorized: {
    title: "Please authenticate",
    description: "You cannot search for desired land by first and last name without authorization.",
  },
  notFound: {
    title: "We could not find your property.",
    description: "Please check your information and try again.",
  },
};

const VoltSearchAlerts: FC<VoltSearchAlertsProps> = ({ error, setError, showUnauthorizedUserAlert }) => {
  const { notify } = useNotification();
  const { targetReached: isSmallDevice, detecting } = useMediaQuery(768);

  useEffect(() => {
    if (isSmallDevice && error) {
      notify(errors.notFound, { variant: "error" });
      setError(null);
    }
  }, [error, isSmallDevice, notify, setError]);

  return (
    <div className="flex flex-col gap-6">
      {showUnauthorizedUserAlert && (
        <Alert variant="warning" title={errors.unauthorized.title} description={errors.unauthorized.description} />
      )}
      {!isSmallDevice && error && (
        <Alert
          handleClose={() => setError(null)}
          variant="warning"
          title={errors.notFound.title}
          description={errors.notFound.description}
        />
      )}
    </div>
  );
};

export default VoltSearchAlerts;
