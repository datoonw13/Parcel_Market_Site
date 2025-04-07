"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { IUserRecentSearches } from "@/types/user";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IUserBaseInfo } from "@/types/auth";
import ResponsiveAlertDialog from "@/components/ui/dialogs/responsive-alert-dialog";
import routes from "@/helpers/routes";
import { breakPoints } from "../../../../../../tailwind.config";
import SearchItemDetailsDesktopContent from "./desktop-content";
import SearchItemDetailsMobileContent from "./mobile-content";
import SearchItemDetailsMobileMapFull from "./mobile-full";

interface SearchItemDetailsProps {
  data: IUserRecentSearches;
  additionalDataResult: IUserRecentSearches;
  user: IUserBaseInfo | null;
  isUserSubscriptionTrial: boolean;
}

const SearchItemDetails: FC<SearchItemDetailsProps> = ({ data, isUserSubscriptionTrial, user, additionalDataResult }) => {
  const router = useRouter();
  const params = useSearchParams();
  const { targetReached: isSmallDevice, detecting } = useMediaQuery(parseFloat(breakPoints.lg));
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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.1, ease: "linear" }}
        >
          {isSmallDevice && !detecting && (
            <div className="py-6 content  bg-primary-main-50 border border-t-0 border-primary-main-400 rounded-b-2xl px-5 lg:px-6">
              <SearchItemDetailsMobileContent
                additionalDataResult={additionalDataResult}
                data={data}
                canExport={!!(user?.isSubscribed && !isUserSubscriptionTrial)}
                isOpen
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
                additionalDataResult={additionalDataResult}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SearchItemDetails;
