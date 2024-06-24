import React from "react";
import Avatar from "@/components/@new/shared/Avatar";
import Popper from "../../shared/Popper";
import UserMenuList from "./UserMenuList";
import { ArrowIconDown1 } from "../../icons/ArrowIcons";

const UserMenu = () => (
  <Popper
    placement="bottom-end"
    renderButton={(setReferenceElement, referenceElement) => (
      <div className="relative" onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}>
        <Avatar title="LG" />
        <div className="shadow-2 bg-white rounded-full w-4 h-4 flex items-center justify-center absolute bottom-0 right-0">
          <ArrowIconDown1 className="m-1 w-4 h-4 cursor-pointer" />
        </div>
      </div>
    )}
    renderContent={(setReferenceElement) => (
      <div className="z-10 rounded-xl bg-white shadow-1 p-6 flex flex-col items-center gap-4 min-w-80">
        <Avatar title="LG" className="w-16 h-16" />
        <div>
          <p className="text-sm font-medium mb-1 text-center">Davit Natelashvili</p>
          <p className="text-xs text-grey-600 text-center">d.natelashvili@Example.com</p>
        </div>
        <div className="bg-grey-30 rounded-xl w-full p-4">
          <UserMenuList close={() => setReferenceElement(null)} />
        </div>
      </div>
    )}
  />
);

export default UserMenu;
