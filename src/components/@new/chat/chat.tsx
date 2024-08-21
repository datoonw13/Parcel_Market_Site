"use client";

import { Session, Inbox } from "@talkjs/react";
import { useSearchParams } from "next/navigation";

export default function Chat() {
  return (
    <div className="h-full">
      <Session appId="tH8dYGgp" userId={'sample_user_alice'}  >
        <Inbox className="h-full" />
      </Session>
    </div>
  );
}
