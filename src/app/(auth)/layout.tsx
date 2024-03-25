import AuthHeader from "@/components/auth/AuthHeader";
import { ReactNode } from "react";

const layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <div>
    <AuthHeader />
    {children}
  </div>
);

export default layout;
