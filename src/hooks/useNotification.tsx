"use client";

import { toast } from "react-toastify";
import ToastNotification from "@/components/shared/toast-notification";

const useNotification = () => {
  const notify = (
    data: { title?: string | null; description?: string | null },
    options?: { variant?: "error" | "success" | "info"; duration?: number }
  ) => {
    if (!data.title && !data.description) {
      return;
    }
    toast(<ToastNotification title={data.title || ""} description={data.description || ""} variant={options?.variant} />, {
      autoClose: options?.duration || 3500,
    });
  };

  return { notify };
};

export default useNotification;
