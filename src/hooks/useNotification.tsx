"use client";

import { toast } from "react-toastify";
import ToastNotification from "@/components/@new/shared/toast-notification";

const useNotification = () => {
  const notify = (
    data: { title?: string | null; description?: string | null },
    options?: { variant?: "error" | "success" | "info"; duration?: number }
  ) => {
    if (!data.title && !data.description) {
      return;
    }

    const toastId = JSON.stringify((data?.title || "") + (data.description || ""));
    if (!toast.isActive(toastId)) {
      toast(<ToastNotification title={data.title || ""} description={data.description || ""} variant={options?.variant} />, {
        autoClose: options?.duration || 3500,
        toastId,
      });
    }
  };

  return { notify };
};

export default useNotification;
