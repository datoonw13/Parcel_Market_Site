import { ReactNode } from "react";
import Container from "@/components/@new/shared/Container";
import UserMenuList from "@/components/@new/user/user-menu/UserMenuList";

const UserLayout = ({ children }: { children: ReactNode }) => (
  <Container className="pt-12">
    <div className="grid lg:grid-cols-[minmax(0,_max-content)_1fr] gap-8">
      <div className="min-w-64 w-full xs:hidden lg:block">
        <UserMenuList listItemClasses="!text-sm" hideLogout />
      </div>
      {children}
    </div>
  </Container>
);

export default UserLayout;
