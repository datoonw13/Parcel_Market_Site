"use client";

import { createContext, memo, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getAuthedUserDataAction, refreshTokenAction } from "@/server-actions/new-auth/new-auth";
import moment from "moment";
import { usePathname } from "next/navigation";
import { revalidateAllPath } from "@/server-actions/subscription/actions";

const AuthContext = createContext<{
  isAuthed: boolean;
  user: null | Awaited<ReturnType<typeof getAuthedUserDataAction>>;
}>({
  isAuthed: false,
  user: null,
});

const AuthContextProvide = ({ children, isAuthed }: { children: ReactNode; isAuthed: boolean }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<Awaited<ReturnType<typeof getAuthedUserDataAction>>>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const setAuthedUser = useCallback(async () => {
    if (isAuthed) {
      const authedUser = await getAuthedUserDataAction();
      setUser(authedUser);
    }
  }, [isAuthed]);

  useEffect(() => {
    setAuthedUser();
  }, [setAuthedUser]);

  return <AuthContext.Provider value={{ isAuthed, user }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvide;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
