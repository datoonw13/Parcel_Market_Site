"use client";

import { Alert } from "@/components/ui/alert";
import routes from "@/helpers/routes";
import Link from "next/link";
import React, { Dispatch, FC, SetStateAction } from "react";

interface VoltSearchAlertsProps {
  error: "limit" | "notFound" | null;
  setError: Dispatch<SetStateAction<"limit" | "notFound" | null>>;
  showUnauthorizedUserAlert: boolean;
}

const errors = {
  unauthorized: {
    title: "Please authenticate",
    description: (
      <span>
        You cannot search for desired land by first and last name without{" "}
        <Link href={routes.auth.signUp.fullUrl}>
          {" "}
          <span className="underline text-warning">authorization</span>
        </Link>{" "}
        or
        <Link href={routes.auth.signIn.fullUrl}>
          {" "}
          <span className="underline text-warning">log in</span>
        </Link>{" "}
      </span>
    ),
  },
  notFound: {
    title: "We could not find your property.",
    description: "Please check your information and try again.",
  },
  limit: {
    title: "You have reached your daily limit.",
    description: (
      <span>
        If you want to increase the daily limit, Please contact{" "}
        <Link href="/">
          {" "}
          <span className="underline text-warning">support</span>
        </Link>{" "}
        for help.
      </span>
    ),
  },
};

const VoltSearchAlerts: FC<VoltSearchAlertsProps> = ({ error, setError, showUnauthorizedUserAlert }) => (
  <div className="flex flex-col gap-6">
    {showUnauthorizedUserAlert && (
      <Alert variant="warning" title={errors.unauthorized.title} description={errors.unauthorized.description} />
    )}
    {error && (
      <Alert
        handleClose={error === "notFound" ? () => setError(null) : undefined}
        variant="warning"
        title={errors[error].title}
        description={errors[error].description}
      />
    )}
  </div>
);

export default VoltSearchAlerts;
