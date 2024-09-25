"use client";

import { FC } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  const params = new URLSearchParams(searchParams);
  return (
    <ResponsiveDialog
      mediaQuery="lg"
      open={open}
      closeModal={closeModal}
      okButton={{
        show: true,
        label: user && !user?.isSubscribed ? "Subscribe" : "Sign In",
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
      title={`${user && !user?.isSubscribed ? "Subscribe" : "Log in"} to See the information`}
      description={
        user && !user?.isSubscribed
          ? "You have not active subscription, if you want to see this information please subscribe"
          : "Your are not logged in, if you want to see this information please log into your account"
      }
    />
  );
};

export default PropertyDetailWarningModal;
