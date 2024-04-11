"use client";

import { setSelectedParcelNumber } from "@/lib/features/slices/authedUserSlice";
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
  const { selectedParcelNumber } = useAppSelector((state) => state.authedUser);

  useEffect(() => {
    if (!selectedParcelNumber) {
      router.push("/");
    }
  }, [router, selectedParcelNumber]);

  useEffect(
    () => () => {
      dispatch(setSelectedParcelNumber(null));
    },
    [dispatch]
  );

  return children;
};

export default PropertySearchSignatureLayout;
