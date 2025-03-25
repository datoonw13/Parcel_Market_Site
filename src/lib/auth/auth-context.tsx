"use client";

import { createContext, memo, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getAuthedUserDataAction, refreshTokenAction } from "@/server-actions/new-auth/new-auth";
import moment from "moment";
import { usePathname } from "next/navigation";
import { revalidateAllPath } from "@/server-actions/subscription/actions";

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
  const pathname = usePathname();
  const [user, setUser] = useState<Awaited<ReturnType<typeof getAuthedUserDataAction>>>({
    data: null,
    isAuthed: false,
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
    window.clearInterval(intervalRef.current);

    if (authedUser.isAuthed && !authedUser.data) {
      await refreshTokenAction();
      revalidateAllPath();

      return;
    }

    if (authedUser?.data) {
      const duration = moment.duration(moment(authedUser.data!.sessionValidUntil).diff(moment()));
      const seconds = duration.asSeconds() - 5;
      let ms = seconds * 1000;

      ms = Math.max(ms, 10000);

      intervalRef.current = setInterval(async () => {
        const request = await refreshTokenAction();
        if (request.errorMessage) {
          stopSession();
        }
        console.log(ms, 22);
      }, ms);
    }
  }, [stopSession]);

  // useEffect(() => {
  //   if (user !== authedUser) {
  //     setUser(authedUser);
  //   }
  // }, [authedUser, user]);

  useEffect(() => {
    if (authedUser?.isAuthed) {
      startSession();
    } else {
      stopSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authedUser, pathname]);

  console.log("rerender");

  return (
    <AuthContext.Provider value={{ user: { ...authedUser } }}>
      {authedUser.isAuthed && !authedUser.data ? "ae" : children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvide;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
