"use client";

import AdditionalInfoSection from "@/components/@new/user/profile/AdditionalInfoSection";
import PersonalInfoSection from "@/components/@new/user/profile/PersonalInfoSection";
import UploadImage from "@/components/@new/user/profile/UploadImage";
import UserMenuList from "@/components/@new/user/user-menu/UserMenuList";
import routes from "@/helpers/routes";
import { useAppSelector } from "@/lib/hooks";
import { getUserAction } from "@/server-actions/user-actions";
import { Container } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const UserProfilePage = () => {
  return (
    <div className="grid gap-6">
      <UploadImage />
      <PersonalInfoSection />
      <AdditionalInfoSection />
    </div>
  )
}

export default UserProfilePage;
