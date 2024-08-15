"use client";

import { useEffect } from "react";

const EventSourceListener = () => {
  useEffect(() => {
    const eventSource = new EventSource(`https://api.parcelmarket.com/api/notifications/48`, { withCredentials: true });
    eventSource.onopen = () => console.log(">>> Connection opened!");
    eventSource.onerror = (e) => console.log("ERROR!", e);
    eventSource.onmessage = (e) => {
      console.log(e);
    };

    return () => {
      eventSource.close();
    };
  }, []);
  return null;
};

export default EventSourceListener;
