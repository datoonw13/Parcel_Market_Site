"use client";

import { Alert } from "@/components/ui/alert";
import routes from "@/helpers/routes";
import Link from "next/link";
import React, { Dispatch, FC, SetStateAction } from "react";
import { RiCloseFill } from "react-icons/ri";
import { Button } from "../ui/button";

interface VoltSearchAlertsProps {
  error: "limit" | "notFound";
  setError: Dispatch<SetStateAction<"limit" | "notFound" | null>>;
  onOk: () => void;
  // showUnauthorizedUserAlert: boolean;
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

const VoltSearchAlerts: FC<VoltSearchAlertsProps> = ({ error, setError, onOk }) => (
  <div className="flex flex-col gap-6">
    <div className="bg-warning-100 py-3 px-4 rounded-xl space-y-2">
      <div className="flex justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="font-semibold text-sm">{errors[error].title}</h1>
          <h2 className="text-grey-800 text-xs">
            Please check your information and try again or do you want to search on th map instead?{" "}
          </h2>
        </div>
        <RiCloseFill onClick={() => setError(null)} className="min-w-6 w-6 min-h-6 h-6 text-grey-600 cursor-pointer" />
      </div>
      <Button onClick={onOk} className="w-full bg-warning/90 hover:bg-warning">
        Search on map
      </Button>
    </div>
  </div>
);

export default VoltSearchAlerts;
