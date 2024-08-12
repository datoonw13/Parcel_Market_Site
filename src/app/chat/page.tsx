"use client";

import { Session, Inbox } from "@talkjs/react";
import { useSearchParams } from "next/navigation";

export default function Chat() {
  const searchParams = useSearchParams();
  return (
    <div className="h-full">
      <Session appId="tRQUwomA" userId={searchParams.get("userId")!}>
        <Inbox className="h-full" />
        {/* <Chatbox conversationId="sample_conversation" /> */}
      </Session>
    </div>
  );
}
