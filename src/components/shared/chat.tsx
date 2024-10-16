"use client";

import Draggable from "react-draggable";
import React, { useEffect, useRef } from "react";
// @ts-ignore
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

const Chat = () => {
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
          className="size-16 cursor-pointer !bg-contain fixed bottom-0 right-0"
          style={{ background: `url(/chat-icon.svg)` }}
        />
      </Draggable>
      <TawkMessengerReact propertyId="66daa46a50c10f7a00a4a8d0" widgetId="1i7314gmo" ref={tawkMessengerRef} />
    </>
  );
};

export default Chat;
