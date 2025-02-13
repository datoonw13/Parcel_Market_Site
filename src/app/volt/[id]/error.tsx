"use client";

import routes from "@/helpers/routes";
import { redirect } from "next/navigation";

const VoltError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  if (process.env.VERCEL_ENV !== "development") {
    redirect(routes.volt.fullUrl);
  }
  return <div className="p-5 bg-error-400 rounded-2xl">{error.message}</div>;
};

export default VoltError;
