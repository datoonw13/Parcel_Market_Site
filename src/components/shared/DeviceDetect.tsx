"use client";

import { isMobile } from "is-mobile";
import { useEffect } from "react";

const DeviceDetect = () => {
  const deviceType = isMobile() ? "mobile" : "desktop";

  useEffect(() => {
    console.log("aqaa");

    document.cookie = `device=${deviceType};`;
  }, [deviceType]);

  return null;
};

export default DeviceDetect;
