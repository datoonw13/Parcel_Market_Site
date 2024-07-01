"use client";

import { useCallback, useEffect } from "react";

const useEnterClick = (callback?: ((ev: any) => void | Promise<void>) | null) => {
  const handleEnterDown = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        callback && callback(ev);
      }
    },
    [callback]
  );

  useEffect(() => {
    if (callback) {
      window.addEventListener("keydown", handleEnterDown);
    } else {
      window.removeEventListener("keydown", handleEnterDown);
    }
    return () => {
      window.removeEventListener("keydown", handleEnterDown);
    };
  }, [handleEnterDown, callback]);

  return null;
};

export default useEnterClick;
