"use client";

import { setSelectedParcelOptions } from "@/lib/features/slices/authedUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const PropertySearchSignatureLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selectedParcelOptions } = useAppSelector((state) => state.authedUser);

  useEffect(() => {
    if (!selectedParcelOptions) {
      router.push("/");
    }
  }, [router, selectedParcelOptions]);

  useEffect(
    () => () => {
      dispatch(setSelectedParcelOptions(null));
    },
    [dispatch]
  );

  return children;
};

export default PropertySearchSignatureLayout;
