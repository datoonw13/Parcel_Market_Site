"use client";

import { FC, useCallback } from "react";
import Talk from "talkjs";
import { Inbox } from "@talkjs/react";

interface ChatProps {
  other: { id: number; firstName: string; lastName: string; email: string } | null;
}

const Chat: FC<ChatProps> = ({ other }) => {
  const syncConversation = useCallback(
    (session: { getOrCreateConversation: (arg0: string) => any; me: any }) => {
      const otherUser = other
        ? new Talk.User({
            id: other.id,
            name: `${other.firstName} ${other.lastName}`,
            email: other.email,
          })
        : null;

      const chatId = otherUser ? Talk.oneOnOneId(session.me, otherUser) : session.me;
      const conversation = session.getOrCreateConversation(chatId);

      conversation.setParticipant(session.me);
      conversation.setParticipant(otherUser);

      return conversation;
    },
    [other]
  );

  return (
    <Inbox
      className="border border-grey-100 rounded-2xl"
      syncConversation={other ? syncConversation : undefined}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default Chat;
