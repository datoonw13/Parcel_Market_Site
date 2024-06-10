import dynamic from "next/dynamic";
import React from "react";

const CometChat = dynamic(() => import("@/components/comet-chat/CometChat"), { ssr: false });

const ChatPage = () => (
  <div>
    <CometChat />
  </div>
);

export default ChatPage;
