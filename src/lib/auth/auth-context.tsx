"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getAuthedUserDataAction, refreshTokenAction } from "@/server-actions/new-auth/new-auth";
import moment from "moment";

const AuthContext = createContext<{
  user: Awaited<ReturnType<typeof getAuthedUserDataAction>>;
}>({
  user: {
    isAuthed: false,
    data: null,
  },
});

const AuthContextProvide = ({
  children,
  authedUser,
}: {
  children: ReactNode;
  authedUser: Awaited<ReturnType<typeof getAuthedUserDataAction>>;
}) => {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getAuthedUserDataAction>>>({
    isAuthed: false,
    data: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const stopSession = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    if (user) {
      setUser({ isAuthed: false, data: null });
    }
  }, [user]);

  const startSession = useCallback(async () => {
    const authedUser = await getAuthedUserDataAction();
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    if (authedUser?.data) {
      const duration = moment.duration(moment(authedUser.data!.sessionValidUntil).diff(moment()));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authedUser]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvide;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
