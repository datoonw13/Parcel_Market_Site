import clsx from "clsx";
import React, { FC } from "react";

type UserProfileSectionHeaderProps = {
  title: string;
  description: string;
  className?: string;
};

const UserProfileSectionHeader: FC<UserProfileSectionHeaderProps> = ({ description, title, className }) => (
  <div className={clsx(className, "mb-8")}>
    <h1 className="font-semibold text-2xl xs:mb-3 md:mb-4">{title}</h1>
    <h2 className="font-medium text-sm text-grey-800">{description}</h2>
  </div>
);

export default UserProfileSectionHeader;
