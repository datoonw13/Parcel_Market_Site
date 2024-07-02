"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { RemoveIcon2 } from "../../icons/RemoveIcons";
import TextField from "../../shared/forms/TextField";
import { EyeIcon1, EyeIcon2 } from "../../icons/EyeIcons";
import Button from "../../shared/forms/Button";
import Divider from "../../shared/Divider";

const ResponsiveModal = dynamic(() => import("../../shared/modals/ResponsiveModal"), { ssr: false });

const UpdatePasswordStep1 = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    repeatNew: false,
  });
  return (
    <div className="space-y-4">
      <TextField
        label="Current password"
        type={showPassword.current ? "text" : "password"}
        endIcon={
          <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>
            {showPassword.current ? <EyeIcon1 /> : <EyeIcon2 />}
          </div>
        }
      />
      <TextField
        label="New password"
        type={showPassword.new ? "text" : "password"}
        endIcon={
          <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
            {showPassword.new ? <EyeIcon1 /> : <EyeIcon2 />}
          </div>
        }
      />
      <TextField
        label="Re-type password"
        type={showPassword.repeatNew ? "text" : "password"}
        endIcon={
          <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, repeatNew: !showPassword.repeatNew })}>
            {showPassword.repeatNew ? <EyeIcon1 /> : <EyeIcon2 />}
          </div>
        }
      />
      <button type="button" className="font-medium text-xs text-primary-main">
        Forgot Password?
      </button>
    </div>
  );
};

const UpdatePasswordContent = () => (
  <div className="sm:bg-white sm:shadow-4 sm:rounded-2xl max-w-lg min-h-[70vh] sm:min-h-fit pb-8 sm:pt-8 relative">
    <div className="hidden sm:block absolute top-4 right-4" onClick={() => {}}>
      <RemoveIcon2 className="fill-grey-600 flex ml-auto cursor-pointer w-3 h-3 p-2 box-content" />
    </div>
    <div className="space-y-2 px-5 sm:px-8 sm:mb-6">
      <h1 className="font-semibold text-lg">Change Password</h1>
      <h6 className="text-grey-800 text-xs">
        Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%).
      </h6>
    </div>
    <Divider className="my-4 sm:hidden" />
    <div className="px-5 sm:px-8">
      <UpdatePasswordStep1 />
    </div>
    <div className="w-full flex flex-col sm:flex-row gap-3 px-5 sm:px-8 mt-8">
      <Button className="w-full" variant="secondary">
        Cancel
      </Button>
      <Button className="w-full">Continue</Button>
    </div>
  </div>
);

const UpdatePasswordModal = () => (
  <ResponsiveModal content={<UpdatePasswordContent />} responsiveContent={<UpdatePasswordContent />} open handleClose={() => {}} />
);

export default UpdatePasswordModal;
