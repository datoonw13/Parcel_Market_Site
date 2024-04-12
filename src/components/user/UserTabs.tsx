import Button from "@/components/shared/Button";
import BookMarkIcon from "@/icons/BookMarkIcon";
import FlagIcon from "@/icons/FlagIcon";
import MailBoxIcon from "@/icons/MailBoxIcon";
import UserCircleIcon from "@/icons/UserCircleIcon";
import { TabsEnum } from "@/types/user";
import React, { Dispatch, SetStateAction } from "react";

interface IUserTabs {
  setSelectedTab: Dispatch<SetStateAction<TabsEnum>>;
  selectedTab: TabsEnum;
}
const UserTabs = ({ selectedTab, setSelectedTab }: IUserTabs) => (
  <div className="flex justify-center gap-10">
    <Button
      onClick={() => setSelectedTab(TabsEnum.PROPERTIES)}
      classNames="w-fit [&>div:nth-child(2)]:hidden lg:[&>div:nth-child(2)]:block"
      type={selectedTab === TabsEnum.PROPERTIES ? "primary" : "tertiary"}
      startIcon={<BookMarkIcon />}
    >
      My Listed properties
    </Button>
    <Button
      onClick={() => setSelectedTab(TabsEnum.OFFERS)}
      classNames="w-fit [&>div:nth-child(2)]:hidden lg:[&>div:nth-child(2)]:block"
      type={selectedTab === TabsEnum.OFFERS ? "primary" : "tertiary"}
      startIcon={<FlagIcon />}
    >
      My Offers
    </Button>
    <Button
      onClick={() => setSelectedTab(TabsEnum.MESSAGES)}
      classNames="w-fit [&>div:nth-child(2)]:hidden lg:[&>div:nth-child(2)]:block"
      type={selectedTab === TabsEnum.MESSAGES ? "primary" : "tertiary"}
      startIcon={<MailBoxIcon />}
    >
      My Messages
    </Button>
    <Button
      onClick={() => setSelectedTab(TabsEnum.ACCOUNT)}
      classNames="w-fit [&>div:nth-child(2)]:hidden lg:[&>div:nth-child(2)]:block"
      startIcon={<UserCircleIcon />}
      type={selectedTab === TabsEnum.ACCOUNT ? "primary" : "tertiary"}
    >
      My Account
    </Button>
  </div>
);

export default UserTabs;
