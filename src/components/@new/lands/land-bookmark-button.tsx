import { useState } from "react";
import { followLand, unFollowLands } from "@/server-actions/follow/actions";
import toast from "react-hot-toast";
import { followedListingsAtom } from "@/atoms/followed-listings-atom";
import { useAtom } from "jotai";
import { BookmarkIcon1, BookmarkIcon2 } from "../icons/BookMarkIcons";
import Button from "../shared/forms/Button";

const LandBookMarkIcon = ({ landId, initialFollowedListingId }: { landId: number; initialFollowedListingId?: number }) => {
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
      if (followedListingsOptions.data) {
        setFollowedListingsOptions((prev) => ({
          ...prev,
          data: prev.data?.map((el) => (el.id === landId ? { ...el, followedListingId: data.id } : { ...el })) || null,
        }));
      }
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
      if (followedListingsOptions.data) {
        setFollowedListingsOptions((prev) => ({
          ...prev,
          data: prev.data?.map((el) => (el.id === landId ? { ...el, followedListingId: undefined } : { ...el })) || null,
        }));
      }
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
