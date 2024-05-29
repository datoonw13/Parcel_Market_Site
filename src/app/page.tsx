"use client";

import useAuthCheck from "@/hooks/useAuthCheck";
import { ReactElement } from "react";

const RootPage = ({ children }: { children: ReactElement }) => {
  useAuthCheck();
  return children;
};

export default RootPage;
