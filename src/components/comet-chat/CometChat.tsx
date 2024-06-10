"use client";

import { UIKitSettingsBuilder } from "@cometchat/uikit-shared";
import { CometChatUIKit, CometChatConversationsWithMessages } from "@cometchat/chat-uikit-react";
import { useEffect, useState } from "react";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useAppSelector } from "@/lib/hooks";
import { CometChat as Chat } from "@cometchat/chat-sdk-javascript";
import { CircularProgress } from "@mui/material";

const COMETCHAT_CONSTANTS = {
  APP_ID: "258993edb46dedf6", // Replace with your App ID
  REGION: "EU", // Replace with your App Region
  AUTH_KEY: "d45257747819de9f4455f4fd0ad13736b0be7677", // Replace with your Auth Key
};

const CometChat = () => {
  const [user, setUser] = useState<any>();
  useAuthCheck();
  const authedUser = useAppSelector((state) => state.authedUser.user);

  const loginUser = async (userUUID: string) => {
    try {
      const res = await CometChatUIKit.login(userUUID);
      return { user: res, error: false };
    } catch (error) {
      return { user: null, error: true };
    }
  };

  const initUser = async () => {
    if (authedUser) {
      const { error, user } = await loginUser(authedUser.id.toString());
      setUser(user);
      if (error) {
        console.log(authedUser.email, 22);
        const newUser = new Chat.User(authedUser.id.toString());
        newUser.setName(authedUser.name);
        try {
          await CometChatUIKit.createUser(newUser);
        } catch (error) {
          console.log(error, 12213);
        }
        const { error, user } = await loginUser(authedUser.email);
        setUser(user);
      }
    }
  };

  const initChat = async () => {
    try {
      const uiKitSettings = new UIKitSettingsBuilder()
        .setAppId(COMETCHAT_CONSTANTS.APP_ID)
        .setRegion(COMETCHAT_CONSTANTS.REGION)
        .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
        .subscribePresenceForAllUsers()
        .build();
      await CometChatUIKit.init(uiKitSettings);
      console.log("Initialization succeeedd...");

      const chatUser = await CometChatUIKit.getLoggedinUser();
      if (!chatUser) {
        await initUser();
      } else {
        setUser(chatUser);
      }
    } catch (error) {
      console.log("Initialization failed with error:", error);
    }
  };

  useEffect(() => {
    if (authedUser) {
      initChat();
    }
  }, [authedUser]);
  return (
    <div className="conversationswithmessages" style={{ width: "100%", height: "100vh" }}>
      <div style={{ width: "100%", height: "100vh" }}>
        {user ? (
          <CometChatConversationsWithMessages user={user} messageText="Conversations With Messages" />
        ) : (
          <CircularProgress sx={{ m: "auto", display: "flex", alignItems: "center" }} />
        )}
      </div>
    </div>
  );
};

export default CometChat;
