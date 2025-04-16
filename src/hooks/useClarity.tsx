"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

export default function MsClarity() {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_CLARITY_ID) {
      Clarity.init(process.env.NEXT_PUBLIC_CLARITY_ID);
    }
  }, []);
  return null;
}
