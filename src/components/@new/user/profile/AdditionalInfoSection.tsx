import React from "react";
import UserProfileSection from "./UserProfileSection";
import Button from "../../shared/forms/Button";
import { EditIcon1 } from "../../icons/EditIcons";
import TextField from "../../shared/forms/TextField";

const AdditionalInfoSection = () => (
  <UserProfileSection
    sectionTitle="Additional Information"
  >
    <div className="grid gap-3">
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">Password</p>
          <p className="font-medium text-xs text-grey-600">Set a permanent password to login to your account</p>
        </div>
        <Button variant="text" className="text-grey-800 !text-xs">Change Password</Button>
      </div>
      <hr className="border-grey-100" />
     
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">Email</p>
          <p className="font-medium text-xs text-grey-600">Davit@Gmail.com</p>
        </div>
        <Button variant="text" className="text-grey-800 !text-xs">Change email Password</Button>
      </div>
      <hr className="border-grey-100" />
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">Delete My Account</p>
          <p className="font-medium text-xs text-grey-600">Permanently delete the account and remove access </p>
        </div>
        <Button variant="text" className="text-grey-800 !text-xs">Deactivate</Button>
      </div>
    </div>
  </UserProfileSection>
);

export default AdditionalInfoSection;
