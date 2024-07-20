import Button from "../../shared/forms/Button";
import { BookmarkIcon1 } from "../../icons/BookMarkIcons";

const FollowLandButton = ({ followId }: { followId: number }) => {
  console.log("aqa");

  return (
    <Button
      className="bg-primary-main-100 hover:bg-primary-main-200 !text-primary-main [&>svg]:!fill-primary-main"
      startIcon={BookmarkIcon1}
    >
      Save Property
    </Button>
  );
};

export default FollowLandButton;
