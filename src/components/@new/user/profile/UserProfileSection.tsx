import React, { FC, ReactElement, ReactNode } from "react";

interface UserProfileSectionProps {
  children: ReactNode;
  sectionTitle: string;
  headerButton?: ReactElement;
}
const UserProfileSection: FC<UserProfileSectionProps> = (props) => {
  const { children, sectionTitle, headerButton } = props;
  return (
    <div className="border border-grey-100 rounded-2xl">
      <div className="border-b border-grey-100 py-4 px-8 flex items-center justify-between">
        <p className="font-medium">{sectionTitle}</p>
        {headerButton && headerButton}
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
};

export default UserProfileSection;
