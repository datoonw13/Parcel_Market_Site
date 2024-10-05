import { ReactNode } from "react";
import Container from "@/components/@new/shared/Container";
import UserMenuList from "@/components/@new/user/user-menu/UserMenuList";

const UserLayout = ({ children }: { children: ReactNode }) => (
  <div className="pt-6 sm:pt-8 md:pt-11  px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw]">
    <div className="grid lg:grid-cols-[minmax(0,_max-content)_1fr] gap-8">
      <div className="min-w-64 w-full xs:hidden lg:block">
        <UserMenuList listItemClasses="!text-sm" hideLogout />
      </div>
      {children}
    </div>
  </div>
);

export default UserLayout;
