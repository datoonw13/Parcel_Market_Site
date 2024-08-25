/* eslint-disable no-nested-ternary */

"use client";

import { useState } from "react";
import { followLand, unFollowLandsAction } from "@/server-actions/follow/actions";
import toast from "react-hot-toast";
import { followedListingsAtom } from "@/atoms/followed-listings-atom";
import { useAtom } from "jotai";
import clsx from "clsx";
import { BookmarkIcon1, BookmarkIcon2 } from "../icons/BookMarkIcons";
import Button from "../shared/forms/Button";
import Popper from "../shared/Popper";

const LandFollowButton = ({
  landId,
  initialFollowedListingId,
  onlyIcon,
  showTooltip,
}: {
  landId: number;
  initialFollowedListingId?: number;
  onlyIcon?: boolean;
  showTooltip?: boolean;
}) => {
  const [followedListingsOptions, setFollowedListingsOptions] = useAtom(followedListingsAtom);
  const [followedListingId, setFollowedListingId] = useState(initialFollowedListingId ?? null);
  const [pending, setPending] = useState(false);

  const handleFollow = async () => {
    setPending(true);
    const { data, errorMessage } = await followLand(landId);
    if (errorMessage) {
      toast.error(errorMessage);
    } else if (data) {
      setFollowedListingId(data.id);
      if (followedListingsOptions) {
        setFollowedListingsOptions(
          followedListingsOptions.map((el) => (el.id === landId ? { ...el, followedListingId: data.id } : { ...el })) || null
        );
      }
    }
    setPending(false);
  };

  const handleUnFollow = async () => {
    setPending(true);
    const { errorMessage } = await unFollowLandsAction([landId]);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      setFollowedListingId(null);
      if (followedListingsOptions) {
        setFollowedListingsOptions(
          followedListingsOptions.map((el) => (el.id === landId ? { ...el, followedListingId: undefined } : { ...el })) || null
        );
      }
    }
    setPending(false);
  };

  return (
    <Popper
      disableSameWidth
      renderButton={(setReferenceElement, referenceElement) => (
        <Button
          onMouseEnter={(e) => showTooltip && setReferenceElement(referenceElement ? null : e.currentTarget)}
          onMouseLeave={(e) => showTooltip && setReferenceElement(null)}
          variant={onlyIcon ? "secondary" : "primary"}
          className={clsx(
            onlyIcon
              ? "!p-0 !outline-none !w-6 !h-6 !bg-white [&>.loading-icon]:!fill-primary-main"
              : "bg-primary-main-100 hover:!bg-primary-main-200 !text-primary-main [&>svg]:!fill-primary-main"
          )}
          onClick={followedListingId ? handleUnFollow : handleFollow}
          loading={pending}
        >
          {onlyIcon ? followedListingId ? <BookmarkIcon2 color="primary-main" /> : <BookmarkIcon1 color="primary-main" /> : null}
          {!onlyIcon && (
            <div className="flex items-center gap-2">
              {followedListingId ? <BookmarkIcon2 color="primary-main" /> : <BookmarkIcon1 color="primary-main" />}
              {followedListingId ? "Unsave" : "Save Property"}
            </div>
          )}
        </Button>
      )}
      renderContent={() => (
        <div className="bg-black rounded-md py-1.5 px-3 text-xss text-white max-w-60 text-center font-medium">
          {followedListingId ? "Unsave" : "Save Property"}
        </div>
      )}
    />
  );
};

export default LandFollowButton;
