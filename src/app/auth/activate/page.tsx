import { activateUserAccountAction } from "@/server-actions/user/actions";
import clsx from "clsx";

const page = async ({ searchParams }: { searchParams: { token?: string } }) => {
  const request = await activateUserAccountAction(searchParams.token);
  return (
    <div className={clsx("p-8 font-semibold text-center ", request?.errorMessage ? "text-error" : "text-success")}>
      {request?.errorMessage ? "Activation failed...." : "Account successfully activated"}
    </div>
  );
};

export default page;
