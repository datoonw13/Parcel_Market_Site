"use client";

import React from "react";
import Avatar from "@/components/@new/shared/Avatar";
import { ISignInResponse } from "@/types/auth";
import Popper from "../../shared/Popper";
import UserMenuList from "./UserMenuList";
import { ArrowIconDown1 } from "../../icons/ArrowIcons";

const UserMenu = ({ user }: { user: ISignInResponse["payload"] }) => (
  <Popper
    placement="bottom-end"
    renderButton={(setReferenceElement, referenceElement) => (
      <div className="relative" onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}>
        <Avatar title={`${user.firstName[0]}${user.lastName[0]}`} />
        <div className="shadow-2 bg-white rounded-full w-4 h-4 flex items-center justify-center absolute bottom-0 right-0">
          <ArrowIconDown1 className="m-1 w-4 h-4 cursor-pointer" />
        </div>
      </div>
    )}
    renderContent={(setReferenceElement) => (
      <div className="z-10 rounded-xl bg-white shadow-1 p-6 flex flex-col items-center gap-4 min-w-80">
        <Avatar title={`${user.firstName[0]}${user.lastName[0]}`} className="w-16 h-16" />
        <div>
          <p className="text-sm font-medium mb-1 text-center">{`${user.firstName} ${user.lastName}`}</p>
          <p className="text-xs text-grey-600 text-center">{user.email}</p>
        </div>
        <div className="bg-grey-30 rounded-xl w-full p-4">
          <UserMenuList close={() => setReferenceElement(null)} />
        </div>
      </div>
    )}
  />
);

export default UserMenu;
