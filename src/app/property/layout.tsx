"use client";

import LogoHeader from "@/components/shared/LogoHeader";
import ProgressBar from "@/components/shared/ProgressBar";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";

type Steps = "info" | "found" | "about" | "estimated-price";

const FindPropertyLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const path = usePathname();
  const router = useRouter();
  const findProperty = useAppSelector((state) => state.findProperty);

  const steps: Steps[] = ["info", "found", "about", "estimated-price"];

  const currentStep = () => {
    const stepName = path.split("/").reverse()[0] as Steps;
    if (stepName === "found") {
      return 2;
    }

    if (stepName === "about") {
      return 3;
    }

    if (stepName === "estimated-price") {
      return 4;
    }
    return 1;
  };

  const handleGoBack = () => {
    const newStepIndex = steps.findIndex((el) => el === steps[(currentStep() - 1) as any]) - 1;
    const newStepName = steps[newStepIndex];
    router.push(`/property/${newStepName}`);
  };

  const handleNavigate = useCallback(() => {
    if (path !== "/property/info" && !findProperty.info) {
      router.push("/property/info");
    }
  }, [findProperty.info, path, router]);

  useEffect(() => {
    // handleNavigate();
  }, [handleNavigate, findProperty]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] lg:grid-cols-[2fr_1fr] h-full">
      <div>
        <LogoHeader classNames="md:bg-white md:!justify-start px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20" />
        <div className="px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20 py-10 flex flex-col gap-10">
          <ProgressBar currentStep={currentStep()} totalSteps={4} goBack={handleGoBack} />
          <div>
            <h1 className="text-dark-green font-bricolage font-bold text-2xl mb-6">Property information</h1>
            <h2 className="text-dark-green-500 font-medium text-xl">Let’s find your property using some basic property information</h2>
          </div>
          {children}
        </div>
      </div>
      <div className="flex-col hidden md:flex">
        <LogoHeader hideLogo />
        <div className="relative w-full h-full bg-neutral ">
          <Image alt="" src="/right-banner.png" fill />
        </div>
      </div>
    </div>
  );
};

export default FindPropertyLayout;
