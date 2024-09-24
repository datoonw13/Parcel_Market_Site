"use client";

import { useCallback, useEffect, useState } from "react";

const useMediaQuery = (width: number) => {
  const [mounted, setMounted] = useState(false);
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback(
    (e: any) => {
      if (!mounted) {
        return;
      }
      if (e.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    },
    [mounted]
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    if (media.addEventListener) {
      media.addEventListener("change", updateTarget);
    } else {
      // compatibility for browser that dont have addEventListener
      media.addListener(updateTarget);
    }
    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }
    if (media.removeEventListener) {
      return () => media.removeEventListener("change", updateTarget);
    }
    // compatibility for browser that dont have removeEventListener
    return () => media.removeListener(updateTarget);
  }, [updateTarget, width]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { detecting: !mounted, targetReached };
};

export default useMediaQuery;
