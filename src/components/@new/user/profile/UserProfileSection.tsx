import React, { FC, ReactElement, ReactNode } from "react";

interface UserProfileSectionProps {
  children: ReactNode;
  sectionTitle: string;
  headerButton?: ReactElement;
  actions?: ReactNode;
}
const UserProfileSection: FC<UserProfileSectionProps> = (props) => {
  const { children, sectionTitle, headerButton, actions } = props;
  return (
    <div className="border border-grey-100 rounded-2xl">
      <div className="border-b border-grey-100 py-4 px-8 flex items-center justify-between">
        <p className="font-medium">{sectionTitle}</p>
        {headerButton && headerButton}
      </div>
      <div className="p-8">{children}</div>
      {actions && (
        <div className="border-t border-grey-100 py-4 px-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">{actions}</div>
      )}
    </div>
  );
};

export default UserProfileSection;
