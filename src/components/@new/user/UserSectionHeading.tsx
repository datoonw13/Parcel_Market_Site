import clsx from "clsx";
import React, { FC } from "react";

type UserSectionTitleProps = {
  title: string;
  description?: string;
  className?: string;
};

const UserSectionTitle: FC<UserSectionTitleProps> = ({ description, title, className }) => (
  <div className={clsx("flex flex-col gap-3 md:gap-4", className)}>
    <h1 className="font-semibold text-2xl">{title}</h1>
    {description && <h2 className="font-medium text-sm text-grey-800">{description}</h2>}
  </div>
);

export default UserSectionTitle;
