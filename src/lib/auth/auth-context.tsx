"use client";

import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { getAuthedUserDataAction, refreshTokenAction } from "@/server-actions/new-auth/new-auth";
import moment from "moment";

const AuthContext = createContext<{
  user: Awaited<ReturnType<typeof getAuthedUserDataAction>>;
}>({
  user: null,
});

const AuthContextProvide = ({
  children,
  authedUser,
}: {
  children: ReactNode;
  authedUser: Awaited<ReturnType<typeof getAuthedUserDataAction>> | null;
}) => {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getAuthedUserDataAction>> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const stopSession = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    if (user) {
      setUser(null);
    }
  }, [user]);

  const startSession = useCallback(async () => {
    const authedUser = await getAuthedUserDataAction();
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    if (authedUser?.user) {
      const duration = moment.duration(moment(authedUser.user!.sessionValidUntil).diff(moment()));
      const seconds = duration.asSeconds() - 5;
      const ms = seconds * 1000;
      intervalRef.current = setInterval(async () => {
        const request = await refreshTokenAction();
        if (request.errorMessage) {
          stopSession();
        }
      }, ms);
    }
  }, [stopSession]);

  useEffect(() => {
    setUser(authedUser);
  }, [authedUser]);

  useEffect(() => {
    if (authedUser?.isAuthed) {
      startSession();
    } else {
      stopSession();
    }
  }, [authedUser, startSession, stopSession]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvide;
