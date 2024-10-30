"use client";

import { FC } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import ResponsiveDialog from "../ui/dialogs/responsive-alert-dialog";

interface PropertyDetailWarningModalProps {
  user: IDecodedAccessToken | null;
  open: boolean;
  closeModal: () => void;
  onOK: () => void;
}

const PropertyDetailWarningModal: FC<PropertyDetailWarningModalProps> = ({ user, open, closeModal, onOK }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams as any);
  return (
    <ResponsiveDialog
      mediaQuery={null}
      open={open}
      closeModal={closeModal}
      okButton={{
        show: true,
        label: "Continue",
        onClick: () => {
          closeModal();
          onOK();
          params.set("redirect_uri", routes.volt.fullUrl);
          router.push(
            user && !user?.isSubscribed
              ? `${routes.user.subscription.fullUrl}?${params.toString()}`
              : `${routes.auth.signIn.fullUrl}?${params.toString()}`
          );
        },
      }}
      cancelButton={{ show: true, label: "Close", onClick: closeModal }}
      title="Please sign in or subscribe to see the sales data"
      description="You will need to sign in or subscribe to view, analyze, or export sales data"
    />
  );
};

export default PropertyDetailWarningModal;
