import Container from "@/components/@new/shared/Container";
import MiniLayout from "@/components/@new/shared/mini-layout";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <MiniLayout className="bg-white sm:bg-grey-30">
    <Container maxWidth="max-w-full">
      <div className="bg-white rounded-2xl max-w-[736px] w-full h-full mx-auto my-auto">{children}</div>
    </Container>
  </MiniLayout>
);

export default AuthLayout;
