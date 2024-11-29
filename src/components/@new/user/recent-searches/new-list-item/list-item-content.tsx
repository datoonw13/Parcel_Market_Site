"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { IUserRecentSearches } from "@/types/user";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { breakPoints } from "../../../../../../tailwind.config";
import RecentSearchesLitItemDesktop from "../list-item/desktop";
import RecentSearchesLitItemMobileMini from "../list-item/mobile-mini";

interface ListItemContentProps {
  data: IUserRecentSearches | null;
  isLast: boolean;
}

const ListItemContent: FC<ListItemContentProps> = ({ data, isLast }) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.lg));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ duration: 0.1, ease: "linear" }}
        className="w-full"
      >
        {isSmallDevice ? (
          data && (
            <div className="py-6">
              <RecentSearchesLitItemMobileMini data={data} canExport={false} isOpen onView={() => {}} />
            </div>
          )
        ) : (
          <div className={cn(isLast ? "" : "border-b")}>
            {data && (
              <RecentSearchesLitItemDesktop data={data} openSubscriptionWarning={() => {}} user={null} isUserSubscriptionTrial={false} />
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ListItemContent;
