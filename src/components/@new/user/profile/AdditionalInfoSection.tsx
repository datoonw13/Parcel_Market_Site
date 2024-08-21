"use client";

import { useState } from "react";
import { IUser } from "@/types/auth";
import UserProfileSection from "./UserProfileSection";
import UpdatePasswordModal from "./modals/update-password-modal/UpdatePasswordModal";
import DeleteAccountModal from "./modals/delete-account-modal/DeleteAccountModal";
import UpdateEmailModal from "./modals/update-email-modal/update-email-modal";

const AdditionalInfoSection = ({ user, isGoogleUser }: { user: IUser; isGoogleUser: boolean }) => {
  const [openModal, setOpenModal] = useState<"updatePassword" | "removeAccount" | "updateEmail" | null>(null);
  return (
    <>
      <DeleteAccountModal open={openModal === "removeAccount"} handleClose={() => setOpenModal(null)} />
      <UpdatePasswordModal user={user} open={openModal === "updatePassword"} handleClose={() => setOpenModal(null)} />
      <UpdateEmailModal user={user} open={openModal === "updateEmail"} handleClose={() => setOpenModal(null)} />
      <UserProfileSection sectionTitle="Additional Information">
        <div className="grid gap-3">
          {!isGoogleUser && (
            <>
              <div className="w-full flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">Password</p>
                  <p className="font-medium text-xs text-grey-600">••••••••••</p>
                </div>
                <button type="button" className="font-medium text-xs text-primary-main" onClick={() => setOpenModal("updatePassword")}>
                  Change Password
                </button>
              </div>
              <hr className="border-grey-100" />

              <div className="w-full flex justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">Email</p>
                  <p className="font-medium text-xs text-grey-600">{user.email}</p>
                </div>
                <button type="button" className="font-medium text-xs text-primary-main" onClick={() => setOpenModal("updateEmail")}>
                  Change Email
                </button>
              </div>
              <hr className="border-grey-100" />
            </>
          )}
          <div className="w-full flex justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-sm">Delete My Account</p>
              <p className="font-medium text-xs text-grey-600">Permanently delete the account and remove access </p>
            </div>
            <button type="button" className="font-medium text-xs text-error" onClick={() => setOpenModal("removeAccount")}>
              Delete
            </button>
          </div>
        </div>
      </UserProfileSection>
    </>
  );
};

export default AdditionalInfoSection;
