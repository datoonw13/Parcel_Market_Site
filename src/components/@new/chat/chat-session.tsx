"use client";

import { IUserBaseInfo } from "@/types/auth";
import { Session } from "@talkjs/react";
import { ReactNode, useCallback } from "react";
import Talk from "talkjs";

const ChatSession = ({ user, children }: { user: IUserBaseInfo | null; children: ReactNode }) => {
  const syncUser = useCallback(
    () =>
      new Talk.User({
        id: user?.id || -1,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
      }),
    [user]
  );

  return user ? (
    <Session appId={process.env.NEXT_PUBLIC_TALKJS_APPID || ""} syncUser={syncUser}>
      {children}
    </Session>
  ) : (
    children
  );
};

export default ChatSession;
