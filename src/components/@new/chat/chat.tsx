// Marks the file as a Next.js Client Component, so that it will only be rendered on the client,
// as the TalkJS JavaScript SDK, which the React SDK uses, can only run in the browser.
// See https://nextjs.org/docs/app/building-your-application/rendering/client-components

"use client";

import { useCallback } from "react";
import Talk from "talkjs";
import { Session, Inbox } from "@talkjs/react";

function Chat() {
  const syncUser = useCallback(
    () =>
      new Talk.User({
        id: "nina",
        name: "Nina",
        email: "nina@example.com",
        photoUrl: "https://talkjs.com/new-web/avatar-7.jpg",
        welcomeMessage: "Hi!",
      }),
    []
  );

  const syncConversation = useCallback((session: { getOrCreateConversation: (arg0: string) => any; me: any }) => {
    // JavaScript SDK code here
    const conversation = session.getOrCreateConversation("xts");

    const other = new Talk.User({
      id: "te22stt",
      name: "tes22t",
      email: "testttt22t@example.com",
      photoUrl: "https://talkjs.com/new-web/avatar-8.jpg",
      welcomeMessage: "Hey, how can I help?",
    });
    conversation.setParticipant(session.me);
    conversation.setParticipant(other);

    return conversation;
  }, []);

  return (
    <Session appId="pnzPvYB9" syncUser={syncUser}>
      <Inbox
        // syncConversation={syncConversation}
        style={{ width: "100%", height: "500px" }}
      />
    </Session>
  );
}

export default Chat;
