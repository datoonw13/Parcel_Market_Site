"use client";

import LogoHeader from "@/components/shared/LogoHeader";
import ProgressBar from "@/components/shared/ProgressBar";
import routes from "@/helpers/routes";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";

const FindPropertyLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const path = usePathname();
  const router = useRouter();
  const findProperty = useAppSelector((state) => state.findProperty);
  const authedUser = useAppSelector((state) => state.authedUser);

  const steps = Object.values(routes.propertySearch);

  const currentStep = () => {
    if (path === routes.propertySearch.found) {
      return 2;
    }

    if (path === routes.propertySearch.about) {
      return 3;
    }

    if (path === routes.propertySearch.estimatedPrice) {
      return 4;
    }
    return 1;
  };

  const handleGoBack = () => {
    const newStepIndex = steps.findIndex((el) => el === steps[(currentStep() - 1) as any]);
    const newStepName = steps[newStepIndex];
    router.push(`${newStepName}`);
  };

  const handleNavigate = useCallback(() => {
    if (
      ["/property-search/info", "/property-search/found", "/property-search/about", "/property-search/estimated-price"].includes(path) &&
      !findProperty.info
    ) {
      router.push("/property-search/info");
    }
  }, [findProperty.info, path, router]);

  useEffect(() => {
    handleNavigate();
  }, [handleNavigate, findProperty, authedUser.user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] lg:grid-cols-[2fr_1fr] h-full">
      <div className="relative">
        <LogoHeader classNames="md:bg-white md:!justify-start px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20" />
        <div className="px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20 py-10 flex flex-col gap-10">
          {!path.includes("signature") && (
            <>
              <ProgressBar currentStep={currentStep()} totalSteps={4} goBack={handleGoBack} />
              <div>
                <h1 className="text-dark-green font-bricolage font-bold text-2xl mb-6">Property information</h1>
                <h2 className="text-dark-green-500 font-medium text-xl">Let’s find your property using some basic property information</h2>
              </div>
            </>
          )}
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
