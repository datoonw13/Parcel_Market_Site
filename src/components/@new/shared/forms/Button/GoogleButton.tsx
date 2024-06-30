import { LoadingIcon1 } from "@/components/@new/icons/LoadingIcons";
import { GoogleIcon1 } from "@/components/@new/icons/SocialNetworkIcons";
import React from "react";

const GoogleButton = ({ onClick, loading }: { onClick: () => void; loading?: boolean }) => (
  <button
    type="button"
    className="w-full p-3 flex justify-center items-center gap-4 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.17)] text-black-400 font-medium rounded-[40px]"
    onClick={onClick}
    disabled={loading}
  >
    <GoogleIcon1 />
    Continue with Google
    {loading && <LoadingIcon1 className="fill-black-400" />}
  </button>
);

export default GoogleButton;
