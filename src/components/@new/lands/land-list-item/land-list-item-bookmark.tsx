"use client";

import { FC } from "react";
import { BookmarkIcon1, BookmarkIcon2 } from "../../icons/BookMarkIcons";
import { LoadingIcon1 } from "../../icons/LoadingIcons";

interface LanListItemBookmarkProps {
  bookmarked?: boolean;
  pending?: boolean;
  onClick: () => void;
}
const LanListItemBookmark: FC<LanListItemBookmarkProps> = ({ bookmarked, onClick, pending }) => (
  <div>
    {!pending && bookmarked && <BookmarkIcon2 />}
    {!pending && !bookmarked && <BookmarkIcon1 />}
    {pending && <LoadingIcon1 color="primary-main" />}
  </div>
);

export default LanListItemBookmark;
