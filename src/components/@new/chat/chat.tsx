"use client";

import { FC, useCallback } from "react";
import Talk from "talkjs";
import { Session, Inbox } from "@talkjs/react";
import { IDecodedAccessToken } from "@/types/auth";

interface ChatProps {
  me: IDecodedAccessToken;
  other: { id: number; firstName: string; lastName: string; email: string } | null;
}

const Chat: FC<ChatProps> = ({ me, other }) => {
  const syncUser = useCallback(
    () =>
      new Talk.User({
        id: me.id,
        name: `${me.firstName} ${me.lastName}`,
        email: me.email,
      }),
    [me.email, me.firstName, me.id, me.lastName]
  );

  const syncConversation = useCallback(
    (session: { getOrCreateConversation: (arg0: string) => any; me: any }) => {
      const otherUser = other
        ? new Talk.User({
            id: other.id,
            name: `${other.firstName} ${other.lastName}`,
            email: other.email,
          })
        : null;

      const chatId = otherUser ? Talk.oneOnOneId(session.me, otherUser) : me.id.toString();
      const conversation = session.getOrCreateConversation(chatId);

      conversation.setParticipant(session.me);
      if (otherUser) {
        conversation.setParticipant(otherUser);
      }

      return conversation;
    },
    [me.id, other]
  );

  return (
    <Session appId="pnzPvYB9" syncUser={syncUser}>
      <Inbox className="border border-grey-100 rounded-2xl" syncConversation={syncConversation} style={{ width: "100%", height: "100%" }} />
    </Session>
  );
};

export default Chat;
