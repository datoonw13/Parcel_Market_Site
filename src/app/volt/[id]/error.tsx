"use client";

import routes from "@/helpers/routes";
import { redirect } from "next/navigation";

const VoltError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  if (error.digest) {
    delete error.digest;
  }
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "development") {
    redirect(routes.volt.fullUrl);
  }
  return <div className="p-5 bg-error-400 rounded-2xl">{error.message}</div>;
};

export default VoltError;
