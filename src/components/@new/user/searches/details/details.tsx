"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { IUserRecentSearches } from "@/types/user";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IDecodedAccessToken } from "@/types/auth";
import ResponsiveAlertDialog from "@/components/ui/dialogs/responsive-alert-dialog";
import routes from "@/helpers/routes";
import { breakPoints } from "../../../../../../tailwind.config";
import SearchItemDetailsDesktopContent from "./desktop-content";
import SearchItemDetailsMobileContent from "./mobile-content";
import SearchItemDetailsMobileMapFull from "./mobile-full";

interface SearchItemDetailsProps {
  data: IUserRecentSearches;
  user: IDecodedAccessToken | null;
  isUserSubscriptionTrial: boolean;
}

const SearchItemDetails: FC<SearchItemDetailsProps> = ({ data, isUserSubscriptionTrial, user }) => {
  const router = useRouter();
  const { targetReached: isSmallDevice, detecting } = useMediaQuery(parseFloat(breakPoints.lg));
  const [showMobileFull, setMobileFull] = useState(false);
  const [subscriptionWarning, setSubscriptionWarning] = useState(false);

  return (
    <>
      <ResponsiveAlertDialog
        mediaQuery={null}
        open={subscriptionWarning}
        closeModal={() => setSubscriptionWarning(false)}
        okButton={{
          show: true,
          label: "Continue",
          onClick: () => {
            setSubscriptionWarning(false);
            router.push(routes.user.subscription.fullUrl);
          },
        }}
        cancelButton={{ show: true, label: "Close", onClick: () => setSubscriptionWarning(false) }}
        title="Please sign in or subscribe to see the sales data"
        description="You will need to sign in or subscribe to view, analyze, or export sales data"
      />
      {showMobileFull && (
        <SearchItemDetailsMobileMapFull data={data} openSubscriptionWarning={() => setSubscriptionWarning(true)} user={user} />
      )}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.1, ease: "linear" }}
          className={cn(showMobileFull && "hidden")}
        >
          {isSmallDevice && !detecting && (
            <div className="py-6 content  bg-primary-main-50 border border-t-0 border-primary-main-400 rounded-b-2xl px-5 lg:px-6">
              <SearchItemDetailsMobileContent
                data={data}
                canExport={!!(user?.isSubscribed && !isUserSubscriptionTrial)}
                isOpen
                onView={() => {
                  setMobileFull(true);
                  // window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
                }}
              />
            </div>
          )}
          {!isSmallDevice && !detecting && (
            <div className="content border-b ">
              <SearchItemDetailsDesktopContent
                data={data}
                user={user}
                openSubscriptionWarning={() => setSubscriptionWarning(true)}
                isUserSubscriptionTrial={isUserSubscriptionTrial}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SearchItemDetails;
