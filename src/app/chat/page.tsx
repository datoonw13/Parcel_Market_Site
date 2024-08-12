import Chat from "@/components/comet-chat/CometChat";
import React, { Suspense } from "react";

const page = () => (
  <Suspense>
    <Chat />
  </Suspense>
);

export default page;
