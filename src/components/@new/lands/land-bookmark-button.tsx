import { useOptimistic, useState } from "react";
import { followLand, unFollowLands } from "@/server-actions/follow/actions";
import toast from "react-hot-toast";
import { BookmarkIcon1, BookmarkIcon2 } from "../icons/BookMarkIcons";
import Button from "../shared/forms/Button";

const LandBookMarkIcon = ({ landId, initialFollowedListingId }: { landId: number; initialFollowedListingId?: number }) => {
  const [followedListingId, setFollowedListingId] = useState(initialFollowedListingId ?? null);
  const [pending, setPending] = useState(false);

  const handleFollow = async () => {
    setPending(true);
    const { data, errorMessage } = await followLand(landId);
    if (errorMessage) {
      toast.error(errorMessage);
    } else if (data) {
      setFollowedListingId(data.id);
    }
    setPending(false);
  };

  const handleUnFollow = async () => {
    setPending(true);
    const { data, errorMessage } = await unFollowLands([landId]);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      setFollowedListingId(null);
    }
    setPending(false);
  };

  return (
    <Button
      variant="secondary"
      className="!p-0 !outline-none !w-6 !h-6 !bg-white [&>.loading-icon]:!fill-primary-main"
      onClick={followedListingId ? handleUnFollow : handleFollow}
      loading={pending}
    >
      {followedListingId ? <BookmarkIcon2 color="primary-main" /> : <BookmarkIcon1 color="primary-main" />}
    </Button>
  );
};

export default LandBookMarkIcon;
