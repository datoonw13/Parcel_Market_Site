"use client";

import AdditionalInfoSection from "@/components/@new/user/profile/AdditionalInfoSection";
import PersonalInfoSection from "@/components/@new/user/profile/PersonalInfoSection";
import UploadImage from "@/components/@new/user/profile/UploadImage";
import UserMenuList from "@/components/@new/user/user-menu/UserMenuList";
import routes from "@/helpers/routes";
import { useAppSelector } from "@/lib/hooks";
import { Container } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const UserProfilePage = () => {
  const router = useRouter();
  const { user, pending } = useAppSelector((state) => state.authedUser);

  useEffect(() => {
    if (!pending && !user) {
      router.push(routes.auth.signIn);
    }
  }, [user, pending, router]);

  return (
    <Container className="pt-12 pb-32">
      <div className="grid grid-cols-[minmax(0,_max-content)_1fr] gap-8">
        <div className="min-w-64 w-full">
          <UserMenuList listItemClasses="!text-sm" hideLogout />
        </div>
        <div className="grid gap-6">
          <UploadImage />
          <PersonalInfoSection />
          <AdditionalInfoSection />
        </div>
      </div>
    </Container>
  );
};

export default UserProfilePage;
