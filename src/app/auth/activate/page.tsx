import { activateUserAccountAction } from "@/server-actions/user/user-actions";
import clsx from "clsx";
import React from "react";

const page = async ({ searchParams }: { searchParams: { token?: string } }) => {
  const { error } = await activateUserAccountAction(searchParams.token);

  return (
    <div className={clsx("p-8 font-semibold text-center ", error ? "text-error" : "text-success")}>
      {error ? "Activation failed...." : "Account successfully activated"}
    </div>
  );
};

export default page;
