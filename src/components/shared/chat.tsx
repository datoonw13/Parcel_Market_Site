"use client";

import Draggable from "react-draggable";
import React, { useEffect, useRef } from "react";
// @ts-ignore
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { useAuth } from "@/lib/auth/auth-context";
import useMediaQuery from "@/hooks/useMediaQuery";
import { breakPoints } from "../../../tailwind.config";

const Chat = () => {
  const { detecting, targetReached: isSm } = useMediaQuery(parseFloat(breakPoints.md));
  const { isAuthed } = useAuth();
  const isDragging = useRef(false);
  const dragItemRef = useRef<HTMLDivElement>(null);
  const tawkMessengerRef = useRef<any>();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const onClick = (e: MouseEvent) => {
    window.clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isDragging.current) {
        e.preventDefault();
        tawkMessengerRef.current.toggle();
      }
    }, 100);
  };

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    []
  );

  return (
    !detecting && (
      <>
        <Draggable
          axis="y"
          nodeRef={dragItemRef}
          bounds="parent"
          defaultClassName=""
          onDrag={() => {
            isDragging.current = true;
          }}
          onStop={() => {
            isDragging.current = false;
          }}
          onMouseDown={onClick}
        >
          <div
            ref={dragItemRef}
            className="size-16 cursor-pointer !bg-contain fixed bottom-0 right-0 z-50"
            style={{ background: `url(/chat-icon.svg)` }}
          />
        </Draggable>
        <TawkMessengerReact
          onLoad={() => {
            if (!isAuthed && !isSm) {
              tawkMessengerRef.current.maximize();
            }
          }}
          propertyId="6716e2212480f5b4f59106ac"
          widgetId="1iaom6lak"
          ref={tawkMessengerRef}
        />
      </>
    )
  );
};

export default Chat;
