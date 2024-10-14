"use client";

import { useCallback, useEffect } from "react";

const useEnterClick = (callback?: ((ev: any) => void | Promise<void>) | null, disabled?: boolean) => {
  const handleEnterDown = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        callback && callback(ev);
      }
    },
    [callback]
  );

  useEffect(() => {
    if (!disabled) {
      if (callback) {
        window.addEventListener("keydown", handleEnterDown);
      } else {
        window.removeEventListener("keydown", handleEnterDown);
      }
    } else {
      window.removeEventListener("keydown", handleEnterDown);
    }
    return () => {
      window.removeEventListener("keydown", handleEnterDown);
    };
  }, [handleEnterDown, callback, disabled]);

  return null;
};

export default useEnterClick;
